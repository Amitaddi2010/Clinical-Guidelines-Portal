import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as pdf from 'pdf-parse';

interface ExtractedContent {
  text: string;
  html?: string;
  images: ExtractedImage[];
  sections: ExtractedSection[];
}

interface ExtractedImage {
  data: Buffer;
  contentType: string;
  filename: string;
}

export interface ExtractedSection {
  title: string;
  content_html: string;
  order_index: number;
}

@Injectable()
export class DocumentUploadService {
  async extractFromDocx(buffer: Buffer): Promise<ExtractedContent> {
    const images: ExtractedImage[] = [];

    const options = {
      convertImage: (mammoth as any).images.inline((element: any) => {
        return element.read().then((imageBuffer: Buffer) => {
          const contentType = element.contentType;
          const extension = contentType.split('/').pop();
          const filename = `image-${images.length + 1}.${extension}`;

          images.push({
            data: imageBuffer,
            contentType,
            filename
          });

          return {
            src: `data:${contentType};base64,${imageBuffer.toString('base64')}`
          };
        });
      })
    };

    const result = await (mammoth as any).convertToHtml({ buffer }, options);
    const textResult = await (mammoth as any).extractRawText({ buffer });
    const sections = this.splitHtmlIntoSections(result.value);

    return {
      text: textResult.value,
      html: result.value,
      images,
      sections
    };
  }

  async extractFromPdf(buffer: Buffer): Promise<ExtractedContent> {
    const data = await (pdf as any)(buffer);
    const html = data.text.split('\n').map((line: string) => `<p>${line}</p>`).join('');
    const sections = this.splitPdfTextIntoSections(data.text);

    return {
      text: data.text,
      html,
      images: [],
      sections
    };
  }

  /**
   * Splits HTML content into sections based on heading tags.
   * Strategy: Find the HIGHEST heading level used, and split ONLY on that level.
   * All lower-level headings remain as content within their parent section.
   * This way, only the top-level document structure becomes sidebar sections.
   */
  splitHtmlIntoSections(html: string): ExtractedSection[] {
    if (!html || html.trim().length === 0) return [];

    // Find which heading levels exist
    const allHeadingsRegex = /<h([1-6])[^>]*>/gi;
    const levelsFound = new Set<number>();
    let m: RegExpExecArray | null;
    while ((m = allHeadingsRegex.exec(html)) !== null) {
      levelsFound.add(parseInt(m[1]));
    }

    if (levelsFound.size === 0) {
      // No headings at all — return everything as one section
      return [{
        title: 'Document Content',
        content_html: html,
        order_index: 0
      }];
    }

    // Use the HIGHEST (smallest number) heading level for splitting
    const splitLevel = Math.min(...Array.from(levelsFound));

    // Find all headings at the split level
    const splitRegex = new RegExp(`<h${splitLevel}[^>]*>(.*?)<\\/h${splitLevel}>`, 'gi');
    const headings: { index: number; fullMatch: string; title: string }[] = [];

    let match: RegExpExecArray | null;
    while ((match = splitRegex.exec(html)) !== null) {
      headings.push({
        index: match.index,
        fullMatch: match[0],
        title: match[1].replace(/<[^>]+>/g, '').trim()
      });
    }

    // Filter out headings with very long titles (likely not real headings — e.g. table cell content)
    const realHeadings = headings.filter(h => h.title.length > 0 && h.title.length < 150);

    if (realHeadings.length === 0) {
      return [{
        title: 'Document Content',
        content_html: html,
        order_index: 0
      }];
    }

    const sections: ExtractedSection[] = [];

    // Content before the first heading becomes "About" / preamble
    const preamble = html.substring(0, realHeadings[0].index).trim();
    if (preamble.length > 0) {
      const textContent = preamble.replace(/<[^>]+>/g, '').trim();
      if (textContent.length > 20) {
        sections.push({
          title: 'About',
          content_html: preamble,
          order_index: 0
        });
      }
    }

    // Create a section for each top-level heading
    for (let i = 0; i < realHeadings.length; i++) {
      const current = realHeadings[i];
      const nextIndex = i + 1 < realHeadings.length ? realHeadings[i + 1].index : html.length;

      // Content starts after the closing tag of the current heading
      const contentStart = current.index + current.fullMatch.length;
      const contentHtml = html.substring(contentStart, nextIndex).trim();

      sections.push({
        title: current.title,
        content_html: contentHtml,
        order_index: sections.length
      });
    }

    return sections;
  }

  /**
   * Splits PDF plain text into sections based on common heading patterns.
   * Only splits on the TOP-LEVEL structure (numbered chapters, Annex, etc.)
   */
  splitPdfTextIntoSections(text: string): ExtractedSection[] {
    if (!text || text.trim().length === 0) return [];

    const lines = text.split('\n');
    const sections: ExtractedSection[] = [];
    let currentTitle = 'Document Content';
    let currentLines: string[] = [];

    // Patterns for TOP-LEVEL headings only
    const topLevelPatterns = [
      /^(\d+)\s+[A-Z]/,                                // "1 Introduction", "2 Methods"
      /^(Annex\s+\d+)/i,                               // "Annex 1."
      /^(Appendix\s+[A-Z0-9])/i,                       // "Appendix A"
      /^(EXECUTIVE SUMMARY|INTRODUCTION|METHODS|METHODOLOGY|RECOMMENDATIONS|ACKNOWLEDGEMENTS|ABBREVIATIONS|ABSTRACT|FOREWORD|PREFACE)/i,
    ];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        currentLines.push('');
        continue;
      }

      let isHeading = false;
      for (const pattern of topLevelPatterns) {
        if (pattern.test(trimmed) && trimmed.length < 120) {
          isHeading = true;
          break;
        }
      }

      if (isHeading) {
        // Save previous section
        if (currentLines.length > 0) {
          const contentText = currentLines.join('\n').trim();
          if (contentText.length > 0) {
            sections.push({
              title: currentTitle,
              content_html: currentLines
                .filter(l => l.trim().length > 0)
                .map(l => `<p>${l.trim()}</p>`)
                .join(''),
              order_index: sections.length
            });
          }
        }
        currentTitle = trimmed;
        currentLines = [];
      } else {
        currentLines.push(trimmed);
      }
    }

    // Save final section
    if (currentLines.length > 0) {
      const contentText = currentLines.join('\n').trim();
      if (contentText.length > 0) {
        sections.push({
          title: currentTitle,
          content_html: currentLines
            .filter(l => l.trim().length > 0)
            .map(l => `<p>${l.trim()}</p>`)
            .join(''),
          order_index: sections.length
        });
      }
    }

    return sections;
  }

  async processDocument(file: any): Promise<ExtractedContent> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext === 'docx') {
      return await this.extractFromDocx(file.buffer);
    } else if (ext === 'pdf') {
      return await this.extractFromPdf(file.buffer);
    }

    throw new Error(`Unsupported file format: ${ext}`);
  }
}
