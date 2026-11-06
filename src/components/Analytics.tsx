import Script from 'next/script'

import { CONSENT_COOKIE } from '@/lib/consent'

import { ConsentBanner } from './ConsentBanner'
import { LeadTracking } from './LeadTracking'

/**
 * Google Analytics 4 with Google Consent Mode v2 (required in the EU). Nothing is stored until the
 * visitor accepts in the cookie banner; a previous choice is restored from the consent cookie.
 * Loaded after the page is interactive so it never hurts Core Web Vitals.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id) return null
  const init = [
    'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;',
    `var c=(document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=(granted|denied)/)||[])[1];`,
    "var s=c==='granted'?'granted':'denied';",
    "gtag('consent','default',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s,wait_for_update:500});",
    "gtag('js',new Date());",
    `gtag('config','${id}');`,
  ].join('')
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <ConsentBanner />
      <LeadTracking />
    </>
  )
}
