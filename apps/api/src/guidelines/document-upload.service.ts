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
   * Splits HTML content into sections based on heading tags (h1-h4).
   * Each heading becomes the title of a new section, and all content
   * until the next heading of equal or higher level becomes the section body.
   */
  splitHtmlIntoSections(html: string): ExtractedSection[] {
    if (!html || html.trim().length === 0) return [];

    const sections: ExtractedSection[] = [];
    // Match heading tags h1-h4 and split content around them
    const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h[1-4]>/gi;
    const matches: { index: number; level: number; title: string }[] = [];

    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(html)) !== null) {
      matches.push({
        index: match.index,
        level: parseInt(match[1]),
        title: match[2].replace(/<[^>]+>/g, '').trim() // Strip inner HTML tags
      });
    }

    if (matches.length === 0) {
      // No headings found — put everything in one section
      sections.push({
        title: 'Document Content',
        content_html: html,
        order_index: 0
      });
      return sections;
    }

    // If there's content before the first heading, create an intro section
    const contentBeforeFirstHeading = html.substring(0, matches[0].index).trim();
    if (contentBeforeFirstHeading.length > 0) {
      // Check if it has real content (not just empty tags)
      const textContent = contentBeforeFirstHeading.replace(/<[^>]+>/g, '').trim();
      if (textContent.length > 0) {
        sections.push({
          title: 'About',
          content_html: contentBeforeFirstHeading,
          order_index: 0
        });
      }
    }

    // Create a section for each heading
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const nextIndex = i + 1 < matches.length ? matches[i + 1].index : html.length;

      // Get all content between this heading and the next one
      // Find the end of the current heading tag first
      const headingEndRegex = new RegExp(`<\\/h${current.level}>`, 'i');
      const headAfter = html.substring(current.index);
      const headEnd = headingEndRegex.exec(headAfter);
      const contentStart = headEnd
        ? current.index + headEnd.index + headEnd[0].length
        : current.index;

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
   * Looks for numbered sections (e.g., "1. Introduction", "2.1 Methods")
   * and ALL-CAPS lines as potential headings.
   */
  splitPdfTextIntoSections(text: string): ExtractedSection[] {
    if (!text || text.trim().length === 0) return [];

    const lines = text.split('\n');
    const sections: ExtractedSection[] = [];
    let currentTitle = 'Document Content';
    let currentLines: string[] = [];

    const headingPatterns = [
      /^(\d+\.?\s+[A-Z])/,                    // "1. Introduction" or "1 Introduction"
      /^(\d+\.\d+\.?\s+)/,                     // "2.1 Methods"
      /^(Chapter\s+\d+)/i,                     // "Chapter 1"
      /^(Annex\s+\d+)/i,                       // "Annex 1"
      /^(Appendix\s+[A-Z0-9])/i,              // "Appendix A"
      /^(EXECUTIVE SUMMARY|INTRODUCTION|METHODS|METHODOLOGY|RECOMMENDATIONS|RESULTS|DISCUSSION|CONCLUSION|CONCLUSIONS|REFERENCES|BIBLIOGRAPHY|ACKNOWLEDGEMENTS|ABBREVIATIONS|ABSTRACT|SUMMARY|FOREWORD|PREFACE)/i,
    ];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        currentLines.push('');
        continue;
      }

      let isHeading = false;
      for (const pattern of headingPatterns) {
        if (pattern.test(trimmed) && trimmed.length < 120) {
          isHeading = true;
          break;
        }
      }

      // Also detect ALL-CAPS lines that are short enough to be headings
      if (!isHeading && trimmed.length > 3 && trimmed.length < 80 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
        isHeading = true;
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

    // If we only got one section, return it as-is
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
