/**
 * Tiny Markdown → Lexical JSON converter for seed content.
 * Supports: ## / ### headings, "- " bullet lists, **bold**, and blank-line paragraphs.
 */

type Node = { type: string; version: number; [k: string]: unknown }

function textNodes(line: string): Node[] {
  return line
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      return { type: 'text', text: bold ? part.slice(2, -2) : part, format: bold ? 1 : 0, detail: 0, mode: 'normal', style: '', version: 1 }
    })
}

const block = (type: string, children: Node[], extra: Record<string, unknown> = {}): Node => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export function markdownToLexical(md: string) {
  const children: Node[] = []
  const chunks = md.trim().split(/\n\s*\n/)
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim())
    if (lines[0].startsWith('### ')) {
      children.push(block('heading', textNodes(lines[0].slice(4)), { tag: 'h3' }))
    } else if (lines[0].startsWith('## ')) {
      children.push(block('heading', textNodes(lines[0].slice(3)), { tag: 'h2' }))
    } else if (lines.every((l) => l.startsWith('- '))) {
      children.push(
        block(
          'list',
          lines.map((l, i) => block('listitem', textNodes(l.slice(2)), { value: i + 1 })),
          { listType: 'bullet', start: 1, tag: 'ul' },
        ),
      )
    } else {
      children.push(block('paragraph', textNodes(lines.join(' ')), { textFormat: 0, textStyle: '' }))
    }
  }
  return { root: { type: 'root', children, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 } }
}
