import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => Boolean(req.user)
export const anyone: Access = () => true

/** Public can read published docs; editors can read drafts too. */
export const publishedOrAdmin: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
