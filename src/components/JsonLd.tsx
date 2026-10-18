type Props = { data: Record<string, unknown> | Array<Record<string, unknown> | null> | null }

/** Renders schema.org JSON-LD. `<` is escaped so content can never break out of the script tag. */
export function JsonLd({ data }: Props) {
  if (!data) return null
  const items = Array.isArray(data) ? data.filter(Boolean) : [data]
  if (items.length === 0) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, '\\u003c') }}
    />
  )
}
