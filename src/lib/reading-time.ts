import type { NoteBlock } from '@/content/types';

/** Words a reader gets through per minute. Prose average; code slows people
 *  down, so code blocks are counted at a third of the rate. */
const WPM = 220;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(body: NoteBlock[]) {
  let count = 0;

  for (const block of body) {
    switch (block.type) {
      case 'list':
        count += block.items.reduce((total, item) => total + words(item), 0);
        break;
      case 'table':
        count += block.rows.flat().reduce((total, cell) => total + words(cell), 0);
        break;
      case 'code':
        count += words(block.code) * 3;
        break;
      default:
        count += words(block.text);
    }
  }

  return Math.max(1, Math.round(count / WPM));
}
