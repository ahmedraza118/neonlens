import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'

import { loadReport } from '@/lib/growth'

const PERIODS = [7, 30, 90]
const SEVERITY = { high: 'Fix first', medium: 'Worth fixing', low: 'Note' }
const num = new Intl.NumberFormat('en-GB')

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="growth-card growth-stat">
      <p className="growth-stat-label">{label}</p>
      <p className="growth-stat-value">{value}</p>
      {note && <p className="growth-muted">{note}</p>}
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: Array<Array<string | number>> }) {
  if (!rows.length) return <p className="growth-muted">No data yet.</p>
  return (
    <div className="growth-table-wrap">
      <table className="growth-table">
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

/** Admin → Growth: are visitors staying, where do they leave, and what should the studio fix first. */
export async function GrowthView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, visibleEntities, permissions, locale } = initPageResult
  if (!req.user) redirect('/admin/login')
  const requested = Number((searchParams as Record<string, string> | undefined)?.days)
  const days = PERIODS.includes(requested) ? requested : 30
  const r = await loadReport(req.payload, days)
  const peak = Math.max(1, ...r.daily.map((d) => d.sessions))

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter className="growth">
        <header className="growth-head">
          <div>
            <h1>Growth dashboard</h1>
            <p className="growth-muted">Who stays, who leaves, and what to fix first. Your own logged-in visits and bots are excluded.</p>
          </div>
          <nav className="growth-periods" aria-label="Period">
            {PERIODS.map((d) => <Link key={d} href={`/admin/growth?days=${d}`} aria-current={d === days ? 'page' : undefined}>{d} days</Link>)}
          </nav>
        </header>

        {r.hasDemoData && <p className="growth-banner"><strong>Demo data.</strong> This local database contains generated visits, so these numbers are not real. Run <code>npm run growth:demo -- --clear</code> to remove them.</p>}

        <section className="growth-grid-4">
          <Stat label="Visits" value={num.format(r.totals.sessions)} note={`${num.format(r.totals.visitors)} daily unique visitors`} />
          <Stat label="Stayed" value={`${r.totals.stayRate}%`} note={`${r.totals.bounceRate}% left immediately`} />
          <Stat label="Engaged time" value={`${r.totals.avgEngaged}s`} note={`${r.totals.pagesPerSession} pages per visit`} />
          <Stat label="Conversion" value={`${r.totals.conversionRate}%`} note={`${r.totals.conversions} leads or booking attempts`} />
        </section>

        <section className="growth-card">
          <h2>What to fix first</h2>
          {r.findings.length === 0 && <p className="growth-muted">No weaknesses detected in this period.</p>}
          <ul className="growth-findings">
            {r.findings.map((f, i) => (
              <li key={i}>
                <span className={`growth-pill growth-pill-${f.severity}`}>{SEVERITY[f.severity]}</span>
                <div>
                  <p className="growth-finding-title">{f.area}: {f.title}</p>
                  <p className="growth-muted">{f.evidence}</p>
                  <p><strong>Do this:</strong> {f.fix}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="growth-card">
          <h2>Visits per day</h2>
          <div className="growth-bars" role="img" aria-label={`Visits per day over the last ${days} days, peak ${peak}`}>
            {r.daily.map((d) => (
              <div key={d.day} className="growth-bar-slot" tabIndex={0} data-tip={`${d.day}: ${d.sessions} visits, ${d.conversions} conversions`}>
                <span className="growth-bar" style={{ height: `${Math.max((d.sessions / peak) * 100, d.sessions ? 2 : 0)}%` }} />
              </div>
            ))}
          </div>
          <div className="growth-axis"><span>{r.daily[0]?.day}</span><span>Peak {peak} visits</span><span>{r.daily.at(-1)?.day}</span></div>
        </section>

        <section className="growth-card">
          <h2>Funnel: where visitors drop off</h2>
          <ol className="growth-funnel">
            {r.funnel.map((s) => (
              <li key={s.step} tabIndex={0} data-tip={`${s.sessions} visits, ${s.ofPrevious}% of the previous step`}>
                <span className="growth-funnel-label">{s.step}</span>
                <span className="growth-track"><span className="growth-fill" style={{ width: `${Math.max(s.ofTotal, s.sessions ? 1 : 0)}%` }} /></span>
                <span className="growth-funnel-value">{num.format(s.sessions)} · {s.ofTotal}%</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="growth-card">
          <h2>Pages: attention and exits</h2>
          <Table head={['Page', 'Views', 'Avg time', 'Scrolled', 'Exit rate', 'Started here', 'Bounce', 'Converted']} rows={r.pages.slice(0, 20).map((p) => [p.path, p.views, `${p.avgSeconds}s`, `${p.avgScroll}%`, `${p.exitRate}%`, p.landings, `${p.bounceRate}%`, `${p.landingConversion}%`])} />
        </section>

        <div className="growth-grid-2">
          <section className="growth-card">
            <h2>Where visitors come from</h2>
            <Table head={['Channel', 'Visits', 'Bounce', 'Conversion']} rows={r.channels.map((c) => [c.key, c.sessions, `${c.bounceRate}%`, `${c.conversionRate}%`])} />
          </section>
          <section className="growth-card">
            <h2>Devices</h2>
            <Table head={['Device', 'Visits', 'Bounce', 'Conversion']} rows={r.devices.map((c) => [c.key, c.sessions, `${c.bounceRate}%`, `${c.conversionRate}%`])} />
          </section>
          <section className="growth-card">
            <h2>Leads</h2>
            <p>{Object.entries(r.pipeline.statusCounts).map(([k, v]) => `${k} ${v}`).join(' · ')}</p>
            <p className="growth-muted">Median first reply {r.pipeline.medianResponseHours}h · closed-lead win rate {r.pipeline.winRate}%</p>
            <Table head={['Source', 'Leads']} rows={r.pipeline.sources.map((s) => [s.key, s.leads])} />
            <p><Link href="/admin/collections/inquiries">Open inquiries →</Link></p>
          </section>
          <section className="growth-card">
            <h2>Bookings</h2>
            <p>Started {r.booking.total} · paid {r.booking.paid} · pending {r.booking.pending} · cancelled {r.booking.cancelled}</p>
            <p className="growth-muted">Booked €{num.format(r.booking.revenueBooked)} · deposits €{num.format(r.booking.depositsTaken)}</p>
            <p><Link href="/admin/collections/bookings">Open bookings →</Link></p>
          </section>
          <section className="growth-card">
            <h2>Chat assistant</h2>
            <p>{r.chat.conversations} chats · {r.chat.leads} leads ({r.chat.leadRate}%) · {r.chat.unanswered} unanswered</p>
            <Table head={['Topic', 'Chats']} rows={r.chat.topics.map((t) => [t.key, t.n])} />
            <p><Link href="/admin/collections/chat-conversations">Read conversations →</Link></p>
          </section>
          <section className="growth-card">
            <h2>Real-visitor speed</h2>
            <Table head={['Metric', '75th percentile', 'Rating', 'Samples']} rows={r.vitals.map((v) => [v.name, `${num.format(v.p75)}${v.unit}`, v.rating, v.samples])} />
          </section>
          <section className="growth-card">
            <h2>Direct contact clicks</h2>
            <Table head={['Type', 'Clicks']} rows={r.contactClicks.map((c) => [c.key, c.n])} />
          </section>
          <section className="growth-card">
            <h2>Most-clicked buttons</h2>
            <Table head={['Button', 'Clicks']} rows={r.ctas.map((c) => [c.key, c.n])} />
          </section>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
