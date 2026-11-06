'use client'

/**
 * Last-resort error page when even the site layout fails (e.g. the database is unreachable).
 * It replaces the whole document, so it is self-contained and bilingual.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fbfaf7', color: '#1d1d1f' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontSize: 32, margin: 0 }}>Ceva n-a mers bine.</h1>
            <p style={{ color: '#5b6066' }}>Te rugăm să încerci din nou peste câteva momente. · Something went wrong, please try again in a moment.</p>
            <button
              type="button"
              onClick={reset}
              style={{ marginTop: 16, padding: '12px 24px', borderRadius: 999, border: 0, background: '#0f766e', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              Încearcă din nou · Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
