/**
 * Simple Markdown parser for island content blocks.
 * Converts headers, blockquotes, bold/italic, lists and paragraphs into HTML strings.
 */
export function renderMarkdownToHtml(markdown: string, variant: 'island' | 'page' = 'island'): string {
  if (!markdown) return '';

  const isPage = variant === 'page';
  const styles = isPage
    ? {
        blockquote: 'border-l-2 border-accent-vermilion pl-5 py-2 my-7 italic text-ink-muted bg-river-mist/35 text-base leading-relaxed font-sans',
        strong: 'font-bold text-ink-primary',
        code: 'font-mono text-sm bg-paper-sheet px-1.5 py-0.5 rounded text-cobalt',
        h1: 'font-sans font-bold text-3xl md:text-5xl text-ink-primary tracking-tight mt-0 mb-6',
        h2: 'font-sans font-bold text-2xl md:text-3xl text-ink-primary tracking-tight mt-10 mb-4',
        h3: 'font-sans font-semibold text-xl text-ink-primary mt-8 mb-3',
        paragraph: 'text-base md:text-lg text-ink-muted leading-relaxed my-4 font-sans',
      }
    : {
        blockquote: 'border-l-2 border-cobalt pl-3 py-1 my-2 italic text-ink-muted bg-river-mist/30 text-[11px] font-sans',
        strong: 'font-bold text-ink-primary',
        code: 'font-mono text-[10px] bg-paper-sheet px-1 py-0.5 rounded text-cobalt',
        h1: 'font-sans font-bold text-sm text-ink-primary mt-2 mb-1',
        h2: 'font-sans font-bold text-xs text-ink-primary mt-2 mb-1',
        h3: 'font-sans font-semibold text-xs text-ink-primary mt-1 mb-1',
        paragraph: 'text-xs text-ink-muted leading-relaxed my-1 font-sans',
      };

  const lines = markdown.split(/\r?\n/);
  const htmlLines: string[] = [];
  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  const flushBlockquote = () => {
    if (blockquoteBuffer.length > 0) {
      const content = parseInline(blockquoteBuffer.join(' '));
      htmlLines.push(`<blockquote class="${styles.blockquote}">${content}</blockquote>`);
      blockquoteBuffer = [];
      inBlockquote = false;
    }
  };

  const parseInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${styles.strong}">$1</strong>`)
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, `<code class="${styles.code}">$1</code>`);
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('>')) {
      inBlockquote = true;
      blockquoteBuffer.push(line.replace(/^>\s*/, ''));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    if (!line) {
      continue;
    }

    if (line.startsWith('# ')) {
      htmlLines.push(`<h1 class="${styles.h1}">${parseInline(line.slice(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      htmlLines.push(`<h2 class="${styles.h2}">${parseInline(line.slice(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      htmlLines.push(`<h3 class="${styles.h3}">${parseInline(line.slice(4))}</h3>`);
    } else {
      htmlLines.push(`<p class="${styles.paragraph}">${parseInline(line)}</p>`);
    }
  }

  if (inBlockquote) {
    flushBlockquote();
  }

  return htmlLines.join('\n');
}
