import { faqSchema } from '@/lib/jsonld'

import { JsonLd } from './JsonLd'

type Props = { faqs: Array<{ question: string; answer: string; id?: string | null }> | null | undefined; heading?: string; withSchema?: boolean }

/** Native <details> accordion — works without JavaScript and is fully crawlable. */
export function Faq({ faqs, heading = 'Frequently asked questions', withSchema = true }: Props) {
  if (!faqs || faqs.length === 0) return null
  return (
    <section className="container-x py-20" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-10 text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.id ?? f.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
              {f.question}
              <span aria-hidden className="text-2xl text-accent transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </section>
  )
}
