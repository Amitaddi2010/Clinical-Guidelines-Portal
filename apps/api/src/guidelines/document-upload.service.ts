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

/*
 * ===================================================================
 * SECTION EXTRACTION STRATEGY
 * ===================================================================
 *
 * Based on the MAGICapp reference sidebar, the user wants this exact
 * section order:
 *
 *  1. Acknowledgements
 *  2. Abbreviations
 *  3. Executive Summary
 *  4. 1 Introduction
 *  5. 2 Methods
 *  6. 3 Recommendations and supporting evidence
 *  7. 4 Dissemination and implementation    (if in document)
 *  8. 5 Research implications               (if in document)
 *  9. 6 Updating the recommendations        (if in document)
 * 10. Annex 1 (Contributors / External experts)
 * 11. Annex 2 (Priority outcomes)           (if in document)
 * 12. Annex 3 (Declaration of Interest / Management of declared interests)
 * 13. References
 * 14. Full Text
 *
 * The Lung Cancer document has these named sections (position-mapped):
 *
 *   @699k  ACKNOWLEDGEMENTS
 *   @700k  ABBREVIATIONS
 *   @709k  EXECUTIVE SUMMARY
 *   @727k  GUIDELINE DEVELOPMENT PROCESS
 *            └ Introduction: @727k
 *            └ Defining the Scope @961k  ← start of "Methods"
 *   @973k  REFERENCES
 *   @974k  First PICO block (start of Recommendations)
 *   @16071k CONTRIBUTORS
 *   @16082k DECLARATION OF INTEREST
 *
 * We extract each section by finding its bold marker, then slicing
 * content from that marker to the next known marker (by document position).
 *
 * "Introduction" and "Methods" are extracted by splitting the
 * GUIDELINE DEVELOPMENT PROCESS section at "Defining the Scope".
 *
 * "Recommendations" = from first PICO block to CONTRIBUTORS.
 * ===================================================================
 */

/** Markers to find in the document, in no particular order. */
const MARKERS: { key: string; searchText: string }[] = [
  { key: 'ACKNOWLEDGEMENTS', searchText: 'ACKNOWLEDGEMENTS' },
  { key: 'ABBREVIATIONS', searchText: 'ABBREVIATIONS' },
  { key: 'EXECUTIVE_SUMMARY', searchText: 'EXECUTIVE SUMMARY' },
  { key: 'GDP', searchText: 'GUIDELINE DEVELOPMENT PROCESS' },
  { key: 'REFERENCES', searchText: 'REFERENCES' },
  { key: 'CONTRIBUTORS', searchText: 'CONTRIBUTORS' },
  { key: 'DECLARATION', searchText: 'DECLARATION OF INTEREST' },
];

/** Sub-markers within the Guideline Development Process section. */
const GDP_METHODS_START = 'Defining the Scope';

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
          images.push({ data: imageBuffer, contentType, filename });
          return { src: `data:${contentType};base64,${imageBuffer.toString('base64')}` };
        });
      })
    };

    const result = await (mammoth as any).convertToHtml({ buffer }, options);
    const textResult = await (mammoth as any).extractRawText({ buffer });
    const sections = this.extractSections(result.value);

    return { text: textResult.value, html: result.value, images, sections };
  }

  async extractFromPdf(buffer: Buffer): Promise<ExtractedContent> {
    const data = await (pdf as any)(buffer);
    const html = data.text.split('\n').map((line: string) => `<p>${line}</p>`).join('');
    const sections = this.extractSections(html);
    return { text: data.text, html, images: [], sections };
  }

  async extractFromHtml(buffer: Buffer): Promise<ExtractedContent> {
    const html = buffer.toString('utf-8');
    const text = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    const sections = this.extractSections(html);
    return { text, html, images: [], sections };
  }

  /**
   * Find position of <strong>TEXT</strong> in html.
   * Returns the full <p>...<strong>TEXT</strong>...</p> bounds.
   */
  private findMarker(html: string, text: string): { start: number; end: number } | null {
    // Try exact match first, then with trailing whitespace (common in DOCX output)
    const variants = [
      `<strong>${text}</strong>`,
      `<strong>${text} </strong>`,
      `<strong>${text}  </strong>`,
    ];
    let idx = -1;
    let matchedNeedle = '';
    for (const needle of variants) {
      idx = html.indexOf(needle);
      if (idx !== -1) { matchedNeedle = needle; break; }
    }
    if (idx === -1) return null;

    // Walk back to <p>
    const before = html.substring(Math.max(0, idx - 60), idx);
    const pIdx = before.lastIndexOf('<p>');
    const pStart = pIdx >= 0 ? (idx - before.length + pIdx) : idx;

    // Walk forward to </p>
    const after = html.substring(idx, idx + matchedNeedle.length + 60);
    const pEnd = after.indexOf('</p>');
    const pEndPos = pEnd >= 0 ? (idx + pEnd + 4) : (idx + matchedNeedle.length);

    return { start: pStart, end: pEndPos };
  }

  /**
   * Find the first PICO question block after REFERENCES.
   * These are ALL-CAPS bold paragraphs like:
   * <p><strong>IN PATIENTS PLANNED FOR LUNG CANCER SURGERY...</strong></p>
   */
  private findFirstPicoBlock(html: string, afterPos: number): number {
    // Search for a bold paragraph that starts with "IN " (common PICO format)
    const searchStr = '<strong>IN ';
    let idx = afterPos;
    while (idx < html.length) {
      idx = html.indexOf(searchStr, idx);
      if (idx === -1) break;

      // Find the full text inside the <strong> tag
      const closeIdx = html.indexOf('</strong>', idx);
      if (closeIdx === -1) { idx += 10; continue; }

      const innerText = html.substring(idx + 8, closeIdx).replace(/<[^>]+>/g, '').trim();

      // Should be ALL-CAPS and longer than 30 chars (a PICO question)
      if (innerText.length > 30 && innerText === innerText.toUpperCase()) {
        // Walk back to find <p>
        const before = html.substring(Math.max(0, idx - 60), idx);
        const pIdx = before.lastIndexOf('<p>');
        return pIdx >= 0 ? (idx - before.length + pIdx) : idx;
      }

      idx += 10;
    }

    return -1;
  }

  /**
   * Shorten a long ALL-CAPS PICO question to a readable title.
   * e.g. "IN PATIENTS WITH OPERABLE NON-SMALL CELL LUNG CANCER, DOES NEOADJUVANT..."
   *  →  "Neoadjuvant Chemotherapy..."
   */
  private shortenPicoTitle(picoQuestion: string): string {
    // Try to extract the key intervention/topic after "DOES ", "WHAT ", "IS ", etc.
    const patterns = [
      /,\s*DOES\s+(.+)/i,
      /,\s*WHAT\s+(.+)/i,
      /,\s*IS\s+(.+)/i,
      /,\s*SHOULD\s+(.+)/i,
      /,\s*(.+)/i, // fallback: everything after the first comma
    ];

    let extracted = picoQuestion;
    for (const pattern of patterns) {
      const match = picoQuestion.match(pattern);
      if (match) {
        extracted = match[1].trim();
        break;
      }
    }

    // Title-case and truncate
    const titleCased = extracted
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase())
      .replace(/\?$/, '');

    // Cap at ~80 chars
    if (titleCased.length > 80) {
      return titleCased.substring(0, 77).replace(/\s+\S*$/, '') + '…';
    }
    return titleCased;
  }

  extractSections(html: string): ExtractedSection[] {
    if (!html || html.trim().length === 0) return [];

    // ---- Find all markers ----
    const positions: Record<string, { start: number; end: number }> = {};

    for (const marker of MARKERS) {
      const found = this.findMarker(html, marker.searchText);
      if (found) {
        positions[marker.key] = found;
      }
    }

    // ---- Find GDP sub-sections ----
    let methodsStart = -1;
    if (positions['GDP']) {
      // Find "Defining the Scope" bold heading within the GDP section
      const needle = `<strong>${GDP_METHODS_START}`;
      const idx = html.indexOf(needle, positions['GDP'].end);
      if (idx >= 0) {
        const before = html.substring(Math.max(0, idx - 60), idx);
        const pIdx = before.lastIndexOf('<p>');
        methodsStart = pIdx >= 0 ? (idx - before.length + pIdx) : idx;
      }
    }

    // ---- Find first PICO block (start of Recommendations) ----
    let recsStart = -1;
    const refsEnd = positions['REFERENCES']?.end || 0;
    if (refsEnd > 0) {
      recsStart = this.findFirstPicoBlock(html, refsEnd);
    }

    // ---- Build sections in MAGICapp order ----
    const result: { title: string; content: string }[] = [];

    const slice = (from: number, to: number) => html.substring(from, to).trim();

    // ===== SECTION ORDER: Introduction → Methods → Recommendations → then others =====

    // 1. Introduction (GDP start to Methods start)
    if (positions['GDP'] && methodsStart > 0) {
      result.push({
        title: '1 Introduction',
        content: slice(positions['GDP'].end, methodsStart)
      });
    } else if (positions['GDP']) {
      const nextPos = positions['REFERENCES']?.start || html.length;
      result.push({
        title: '1 Introduction',
        content: slice(positions['GDP'].end, nextPos)
      });
    }

    // 2. Methods (Methods start to REFERENCES)
    if (methodsStart > 0 && positions['REFERENCES']) {
      result.push({
        title: '2 Methods',
        content: slice(methodsStart, positions['REFERENCES'].start)
      });
    }

    // 3. Recommendations and supporting evidence — split by PICO questions
    if (recsStart > 0) {
      const recsEnd = positions['CONTRIBUTORS']?.start || html.length;
      const recsHtml = html.substring(recsStart, recsEnd);

      // Find all PICO question headings: <p><strong>IN ... (all-caps, >30 chars)
      const picoPattern = /<p><strong>(IN [A-Z][^<]{30,})<\/strong>/g;
      const picoPositions: { index: number; title: string }[] = [];
      let picoMatch;

      while ((picoMatch = picoPattern.exec(recsHtml)) !== null) {
        const innerText = picoMatch[1].replace(/<[^>]+>/g, '').trim();
        // Verify it's an actual PICO question (mostly uppercase and ends with ?)
        if (innerText.length > 30 && innerText === innerText.toUpperCase()) {
          picoPositions.push({ index: picoMatch.index, title: innerText });
        }
      }

      if (picoPositions.length > 1) {
        // Split into sub-sections per PICO question
        for (let i = 0; i < picoPositions.length; i++) {
          const from = picoPositions[i].index;
          const to = (i + 1 < picoPositions.length) ? picoPositions[i + 1].index : recsHtml.length;
          const picoContent = recsHtml.substring(from, to).trim();

          // Create a short title from the PICO question
          const shortTitle = this.shortenPicoTitle(picoPositions[i].title);

          result.push({
            title: `3.${i + 1} ${shortTitle}`,
            content: picoContent
          });
        }
      } else {
        // Only one or no PICO block — keep as single section
        result.push({
          title: '3 Recommendations and supporting evidence',
          content: slice(recsStart, recsEnd)
        });
      }
    }


    // 4. Acknowledgements
    if (positions['ACKNOWLEDGEMENTS']) {
      const nextPos = positions['ABBREVIATIONS']?.start || positions['EXECUTIVE_SUMMARY']?.start || positions['GDP']?.start || html.length;
      result.push({
        title: 'Acknowledgements',
        content: slice(positions['ACKNOWLEDGEMENTS'].end, nextPos)
      });
    }

    // 5. Abbreviations
    if (positions['ABBREVIATIONS']) {
      const nextPos = positions['EXECUTIVE_SUMMARY']?.start || positions['GDP']?.start || html.length;
      result.push({
        title: 'Abbreviations',
        content: slice(positions['ABBREVIATIONS'].end, nextPos)
      });
    }

    // 6. Executive Summary
    if (positions['EXECUTIVE_SUMMARY']) {
      const nextPos = positions['GDP']?.start || html.length;
      result.push({
        title: 'Executive Summary',
        content: slice(positions['EXECUTIVE_SUMMARY'].end, nextPos)
      });
    }

    // 7. Annex 1 — Contributors
    if (positions['CONTRIBUTORS']) {
      const nextPos = positions['DECLARATION']?.start || html.length;
      result.push({
        title: 'Annex 1. Contributors',
        content: slice(positions['CONTRIBUTORS'].end, nextPos)
      });
    }

    // 8. Annex 3 — Declaration of Interest
    if (positions['DECLARATION']) {
      result.push({
        title: 'Annex 3. Summary and management of declared interests',
        content: slice(positions['DECLARATION'].end, html.length)
      });
    }

    // 9. References
    if (positions['REFERENCES'] && recsStart > 0) {
      result.push({
        title: 'References',
        content: slice(positions['REFERENCES'].end, recsStart)
      });
    } else if (positions['REFERENCES']) {
      const nextPos = positions['CONTRIBUTORS']?.start || html.length;
      result.push({
        title: 'References',
        content: slice(positions['REFERENCES'].end, nextPos)
      });
    }

    // ---- Build final section array ----
    const sections: ExtractedSection[] = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].content.length > 0) {
        sections.push({
          title: result[i].title,
          content_html: result[i].content,
          order_index: i
        });
      }
    }

    // Always append Full Text
    sections.push({
      title: 'Full Text',
      content_html: html,
      order_index: sections.length
    });

    return sections;
  }

  async processDocument(file: any): Promise<ExtractedContent> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext === 'docx') return await this.extractFromDocx(file.buffer);
    if (ext === 'pdf') return await this.extractFromPdf(file.buffer);
    if (ext === 'html' || ext === 'htm') return await this.extractFromHtml(file.buffer);
    throw new Error(`Unsupported file format: ${ext}`);
  }
}
