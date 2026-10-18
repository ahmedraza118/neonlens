import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-5xl font-bold">Out of focus.</h1>
        <p className="mt-4 text-muted">That page doesn&apos;t exist (anymore). Try the portfolio instead.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/portfolio" className="btn-primary">See our work</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </section>
  )
}
