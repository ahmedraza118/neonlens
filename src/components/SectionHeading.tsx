import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  children?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cn('mb-12 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className={cn('font-bold', Tag === 'h1' ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl')}>{title}</Tag>
      {children && <div className="mt-5 text-lg text-muted">{children}</div>}
    </div>
  )
}
