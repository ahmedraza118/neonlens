import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are statically generated and cached. When content changes in the CMS we purge
 * the whole site cache — it's a small site, so this is simpler and safer than tracking
 * exactly which pages reference which documents.
 */
async function purge(context: Record<string, unknown>) {
  // The seed script and CLI scripts run outside Next.js, where revalidation is unavailable.
  if (context?.disableRevalidate) return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside a Next.js request — nothing to revalidate.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, context }) => {
  await purge(context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, context }) => {
  await purge(context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, context }) => {
  await purge(context)
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
