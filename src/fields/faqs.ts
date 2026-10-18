import type { Field } from 'payload'

/** Question/answer pairs. Rendered as an accordion and emitted as FAQPage structured data. */
export const faqsField: Field = {
  name: 'faqs',
  type: 'array',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { initCollapsed: true },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
}
