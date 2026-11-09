/**
 * Prints the growth report: `npm run growth:report` (Markdown), add `-- --days 7` or `-- --json`.
 * Read-only. This is the data source for the growth agents in .claude/agents.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { loadReport, reportToMarkdown } from '@/lib/growth'

const arg = process.argv.indexOf('--days')
const days = arg > -1 ? Number(process.argv[arg + 1]) : 30
const payload = await getPayload({ config })
const report = await loadReport(payload, Number.isFinite(days) && days > 0 ? days : 30)
console.log(process.argv.includes('--json') ? JSON.stringify(report, null, 2) : reportToMarkdown(report))
process.exit(0)
