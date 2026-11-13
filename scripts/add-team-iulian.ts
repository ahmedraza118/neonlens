/**
 * Adds Iulian to the team (Romanian + English), with his skills dashboard linked to the services.
 * Run once: `npm run team:iulian`. Safe to re-run: it does nothing if he already exists.
 *
 * His portrait is a plain grey placeholder: replace it in /admin → Team → Iulian → Photo with a
 * real, recent photo (4:5, e.g. 1600×2000). Adjust the skill levels there too.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'team', where: { slug: { equals: 'iulian' } }, limit: 1 })
if (existing.docs.length > 0) {
  console.log('Iulian is already on the team: nothing to do.')
  process.exit(0)
}

const services = (await payload.find({ collection: 'services', limit: 50, locale: 'ro', depth: 0 })).docs
const serviceId = (slug: string) => services.find((s) => s.slug === slug)?.id

// Grey stand-in (named placeholder-… so it stays out of Google and share previews until replaced).
const buffer = await sharp({ create: { width: 1600, height: 2000, channels: 3, background: { r: 226, g: 222, b: 216 } } }).jpeg({ quality: 70 }).toBuffer()
const photo = await payload.create({
  collection: 'media',
  data: { alt: 'Iulian, fotograf și videograf Lumenza', altNeedsReview: true },
  file: { data: buffer, mimetype: 'image/jpeg', name: 'placeholder-team-iulian.jpg', size: buffer.length },
})
await payload.update({ collection: 'media', id: photo.id, locale: 'en', data: { alt: 'Iulian, Lumenza photographer and videographer' } })

// Strongest first. Romanian names here; English names are set below on the same rows.
const skills = [
  { ro: 'Fotografie de nuntă', en: 'Wedding photography', level: 'expert', service: serviceId('fotograf-nunta') },
  { ro: 'Fotografie de evenimente', en: 'Event photography', level: 'expert', service: serviceId('fotograf-evenimente-corporate') },
  { ro: 'Videografie de nuntă', en: 'Wedding videography', level: 'advanced', service: serviceId('videograf-nunta') },
  { ro: 'Fotografie comercială', en: 'Commercial photography', level: 'advanced', service: serviceId('fotografie-produs') },
  { ro: 'Fotografie wildlife', en: 'Wildlife photography', level: 'advanced', service: undefined },
] as const

const member = await payload.create({
  collection: 'team',
  locale: 'ro',
  data: {
    name: 'Iulian',
    slug: 'iulian',
    role: 'Fotograf și videograf',
    disciplines: ['photographer', 'videographer'],
    photo: photo.id,
    since: 2016,
    languages: ['ro', 'en'],
    shortBio: 'Peste 10 ani de nunți, evenimente și proiecte comerciale în București și Ilfov. Fotografiază și filmează, în română sau engleză.',
    bio: `Iulian fotografiază și filmează de peste zece ani: nunți, evenimente și proiecte comerciale în București, în Ilfov și în împrejurimi.

Pasiunea pentru fotografia wildlife l-a învățat răbdarea și reflexele de care ai nevoie la o nuntă: să anticipezi momentul și să fii pregătit când se întâmplă. Lucrează în română și în engleză, așa că și invitații veniți din străinătate se simt în largul lor.`,
    specialties: ['Nunți', 'Evenimente', 'Comercial', 'Wildlife'],
    skills: skills.map((s) => ({ name: s.ro, level: s.level, service: s.service })),
    services: [serviceId('fotograf-nunta'), serviceId('videograf-nunta'), serviceId('fotograf-evenimente-corporate'), serviceId('fotografie-produs')].filter(
      (id): id is number => typeof id === 'number',
    ),
    visible: true,
    featured: true,
    order: 0,
  },
})

// English text on the same rows (array rows keep their ids; only translated fields change).
await payload.update({
  collection: 'team',
  id: member.id,
  locale: 'en',
  data: {
    role: 'Photographer & videographer',
    shortBio: '10+ years of weddings, events and commercial work in Bucharest and Ilfov. He shoots both photo and video, in English or Romanian.',
    bio: `Iulian has been photographing and filming for more than ten years: weddings, events and commercial projects across Bucharest, Ilfov and the surrounding area.

Wildlife photography taught him the patience and reflexes a wedding needs: reading the moment before it happens and being ready when it does. He works in English and Romanian, so guests from abroad feel at home too.`,
    specialties: ['Weddings', 'Events', 'Commercial', 'Wildlife'],
    skills: (member.skills ?? []).map((row, i) => ({ ...row, name: skills[i].en })),
  },
})

console.log(`Added Iulian (id ${member.id}) with ${skills.length} skills. Replace his placeholder photo in /admin → Team.`)
process.exit(0)
