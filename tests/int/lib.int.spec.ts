import { describe, expect, it } from 'vitest'

import { decodeClientSession, encodeClientSession, galleryIdsFromCookieHeader } from '@/lib/client-session'
import { hashPassword, verifyPassword } from '@/lib/password'
import { calculateQuote, depositFor, type Rate } from '@/lib/quote'
import { isGenericFilename, slugify } from '@/lib/utils'

const rate: Rate = { serviceId: 1, baseFee: 600, hourlyRate: 160, minHours: 6, maxHours: 14 }

describe('calculateQuote', () => {
  it('adds base fee, hours, add-ons and travel, and returns a rounded range', () => {
    const q = calculateQuote({
      rate,
      hours: 8,
      addOns: [{ id: 'drone', name: 'Drone', price: 250, unit: 'flat', serviceIds: [1] }],
      travelFee: 80,
      spreadPercent: 10,
    })
    expect(q.total).toBe(600 + 160 * 8 + 250 + 80)
    expect(q.low).toBe(1990)
    expect(q.high).toBe(2430)
  })

  it('clamps hours to the allowed range', () => {
    expect(calculateQuote({ rate, hours: 2, addOns: [] }).hours).toBe(6)
    expect(calculateQuote({ rate, hours: 40, addOns: [] }).hours).toBe(14)
  })

  it('charges per-hour add-ons by the hour and ignores add-ons for other services', () => {
    const q = calculateQuote({
      rate,
      hours: 10,
      addOns: [
        { id: 'a', name: 'Second shooter', price: 50, unit: 'perHour', serviceIds: [] },
        { id: 'b', name: 'Other service only', price: 999, unit: 'flat', serviceIds: [2] },
      ],
    })
    expect(q.total).toBe(600 + 1600 + 500)
  })

  it('computes deposits', () => {
    expect(depositFor(1900, 30)).toBe(570)
    expect(depositFor(1000, 150)).toBe(1000)
  })
})

describe('client gallery session', () => {
  it('round-trips gallery ids and rejects tampering', () => {
    const token = encodeClientSession([3, 7])
    expect(decodeClientSession(token)).toEqual(['3', '7'])
    const [body] = token.split('.')
    expect(decodeClientSession(`${body}.forged`)).toEqual([])
    expect(galleryIdsFromCookieHeader(`a=1; nl_client=${encodeURIComponent(token)}`)).toEqual(['3', '7'])
  })
})

describe('passwords', () => {
  it('verifies the right password only', () => {
    const hash = hashPassword('correct horse')
    expect(verifyPassword('correct horse', hash)).toBe(true)
    expect(verifyPassword('wrong', hash)).toBe(false)
    expect(verifyPassword('x', null)).toBe(false)
  })
})

describe('utils', () => {
  it('slugifies diacritics', () => {
    expect(slugify('Brașov — Poiana Brașov!')).toBe('brasov-poiana-brasov')
  })
  it('detects camera file names', () => {
    expect(isGenericFilename('IMG_4021.jpg')).toBe(true)
    expect(isGenericFilename('DSC00042.JPG')).toBe(true)
    expect(isGenericFilename('bride-at-sunset.jpg')).toBe(false)
  })
})
