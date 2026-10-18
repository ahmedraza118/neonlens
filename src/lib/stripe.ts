import 'server-only'

import Stripe from 'stripe'

let client: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  client ??= new Stripe(key)
  return client
}

/** Stripe amounts are in the smallest currency unit; zero-decimal currencies are rare for us. */
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100)
}
