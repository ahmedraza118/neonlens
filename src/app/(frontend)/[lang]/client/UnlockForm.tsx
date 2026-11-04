'use client'

import { useActionState } from 'react'

import { type UnlockState, unlockGallery } from '@/actions/gallery'
import { useI18n } from '@/i18n/client'

export function UnlockForm({ slug }: { slug?: string }) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockGallery, { message: '' })
  const { lang, t } = useI18n()
  return (
    <form action={action} className="card mx-auto mt-10 max-w-md space-y-4 p-8 text-left">
      <input type="hidden" name="lang" value={lang} />
      {slug ? (
        <input type="hidden" name="slug" value={slug} />
      ) : (
        <div>
          <label htmlFor="g-slug" className="label">{t.client.code}</label>
          <input id="g-slug" name="slug" required className="input" placeholder={t.client.codePlaceholder} autoCapitalize="none" />
        </div>
      )}
      <div>
        <label htmlFor="g-pass" className="label">{t.client.password}</label>
        <input id="g-pass" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? t.client.opening : t.client.open}
      </button>
      {state.message && <p role="alert" className="text-sm text-accent">{state.message}</p>}
    </form>
  )
}
