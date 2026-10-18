'use client'

import { useActionState } from 'react'

import { type UnlockState, unlockGallery } from '@/actions/gallery'

export function UnlockForm({ slug }: { slug?: string }) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockGallery, { message: '' })
  return (
    <form action={action} className="card mx-auto mt-10 max-w-md space-y-4 p-8 text-left">
      {slug ? (
        <input type="hidden" name="slug" value={slug} />
      ) : (
        <div>
          <label htmlFor="g-slug" className="label">Gallery code</label>
          <input id="g-slug" name="slug" required className="input" placeholder="e.g. ana-and-mihai-wedding" autoCapitalize="none" />
        </div>
      )}
      <div>
        <label htmlFor="g-pass" className="label">Password</label>
        <input id="g-pass" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Opening…' : 'Open gallery'}
      </button>
      {state.message && <p role="alert" className="text-sm text-accent">{state.message}</p>}
    </form>
  )
}
