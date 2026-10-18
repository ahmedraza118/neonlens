import { ImageResponse } from 'next/og'

/** Branded 1200×630 social card for pages without their own photo: /og?title=…&eyebrow=… */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'NeonLens Studio').slice(0, 120)
  const eyebrow = (searchParams.get('eyebrow') ?? 'Photography & Film').slice(0, 80)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 80,
          background: 'linear-gradient(135deg, #fbfaf7 0%, #e4f3ef 100%)',
          color: '#1d1d1f',
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600, color: '#0f766e' }}>{eyebrow}</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, marginTop: 20, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 26, marginTop: 40, color: '#5b6066' }}>NeonLens Studio</div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400, immutable' } },
  )
}
