import { describe, expect, it } from 'vitest'

import { decodeClientSession, encodeClientSession, galleryEntriesFromCookieHeader, passwordVersion, validGalleryIds } from '@/lib/client-session'
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
  it('round-trips gallery entries and rejects tampering', () => {
    const entries = [
      { id: '3', v: passwordVersion('hash-a') },
      { id: '7', v: passwordVersion('hash-b') },
    ]
    const token = encodeClientSession(entries)
    expect(decodeClientSession(token)).toEqual(entries)
    const [body] = token.split('.')
    expect(decodeClientSession(`${body}.forged`)).toEqual([])
    expect(galleryEntriesFromCookieHeader(`a=1; nl_client=${encodeURIComponent(token)}`)).toEqual(entries)
  })

  it('stops granting access after a password change or expiry', () => {
    const entries = [{ id: '3', v: passwordVersion('old-hash') }]
    expect(validGalleryIds(entries, [{ id: 3, passwordHash: 'old-hash' }])).toEqual(['3'])
    expect(validGalleryIds(entries, [{ id: 3, passwordHash: 'new-hash' }])).toEqual([])
    expect(validGalleryIds(entries, [{ id: 3, passwordHash: 'old-hash', expiresAt: '2020-01-01T00:00:00Z' }])).toEqual([])
    expect(validGalleryIds(entries, [{ id: 4, passwordHash: 'old-hash' }])).toEqual([])
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

describe('i18n routing', () => {
  it('maps internal paths to public Romanian and English URLs and back', async () => {
    const { parsePublicPath, withLocale } = await import('@/i18n/config')
    expect(withLocale('/services/fotograf-nunta/snagov', 'ro')).toBe('/servicii/fotograf-nunta/snagov')
    expect(withLocale('/book/success?session_id=1', 'ro')).toBe('/rezervare/confirmare?session_id=1')
    expect(withLocale('/services/wedding-photography', 'en')).toBe('/en/services/wedding-photography')
    expect(withLocale('/', 'en')).toBe('/en')
    expect(parsePublicPath('/zone/bucuresti')).toEqual({ lang: 'ro', path: '/locations/bucuresti' })
    expect(parsePublicPath('/en/about')).toEqual({ lang: 'en', path: '/about' })
    expect(parsePublicPath('/')).toEqual({ lang: 'ro', path: '/' })
  })
})

describe('seo', () => {
  it('clamps long meta descriptions at a word boundary', async () => {
    const { clampDescription } = await import('@/lib/seo')
    const long = 'Fotograf și videograf de nuntă în București și Ilfov. '.repeat(6)
    const out = clampDescription(long)
    expect(out.length).toBeLessThanOrEqual(158)
    expect(out.endsWith('…')).toBe(true)
    expect(clampDescription('Scurt.')).toBe('Scurt.')
  })
})
