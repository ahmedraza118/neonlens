/**
 * Lumenza's real business details, used by `npm run seed:launch` to fill the live site.
 *
 * Fill in every TODO before launching. Name, address and phone (NAP) must match your Google
 * Business Profile exactly, character for character, or Google may treat them as two businesses.
 * Everything here can also be changed later in /admin → Site settings.
 */
export const business = {
  name: 'Lumenza',
  email: 'official.lumenza@gmail.com', // an inbox you actually read
  phone: '+40 757 097 435', // international format, e.g. +40 7xx xxx xxx
  whatsapp: '40757097435', // digits only, e.g. 407xxxxxxxx (leave '' if you don't use WhatsApp)
  // A studio you receive clients at. If you only travel to clients, keep street and postalCode ''
  // (Google calls this a "service-area business") and the site shows only the city.
  address: { street: '', city: 'București', region: 'București', postalCode: '', country: 'RO' },
  // Studio location, or the centre of Bucharest for a service-area business.
  geo: { lat: 44.4268, lng: 26.1025 },
  foundingYear: 2016, // "10 years of experience"
  // Only real profiles; leave '' for networks you don't use.
  social: { instagram: '', facebook: '', youtube: '', tiktok: '' },
  // Paste these after the Google Business Profile exists (Profile → Share, and Ask for reviews).
  googleBusinessProfileUrl: '',
  googleReviewUrl: '',
  about: {
    en: {
      heading: 'Ten years of weddings, christenings and brands in Bucharest.',
      body: `Lumenza is a photo and video studio from Bucharest. For ten years we have photographed and filmed weddings, christenings, events and brand work across Bucharest, Ilfov County and the towns around the capital.

We plan every shoot carefully and then let real moments happen on the day. Write to us in Romanian or English and tell us about your plans.`,
    },
    ro: {
      heading: 'Zece ani de nunți, botezuri și branduri în București.',
      body: `Lumenza este un studio foto-video din București. De zece ani fotografiem și filmăm nunți, botezuri, evenimente și proiecte pentru branduri în București, în județul Ilfov și în localitățile din jurul Capitalei.

Pregătim fiecare ședință cu grijă, iar în ziua evenimentului lăsăm momentele reale să se întâmple. Scrieți-ne în română sau în engleză și povestiți-ne ce plănuiți.`,
    },
  },
}

/** Fields still holding a TODO placeholder. */
export const missingBusinessDetails = () =>
  Object.entries({ email: business.email, phone: business.phone, whatsapp: business.whatsapp })
    .filter(([, v]) => v.includes('TODO'))
    .map(([k]) => k)
