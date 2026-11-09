import Link from 'next/link'

export function GrowthNavLink() {
  return (
    <Link href="/admin/growth" className="growth-nav-link">
      📈 Growth dashboard
    </Link>
  )
}
