/** Renders plain textarea content, treating blank lines as paragraph breaks. */
export function Paragraphs({ text, className }: { text: string | null | undefined; className?: string }) {
  if (!text) return null
  return (
    <div className={className}>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="mb-4 last:mb-0">
            {p}
          </p>
        ))}
    </div>
  )
}
