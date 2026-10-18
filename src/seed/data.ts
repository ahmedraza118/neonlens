/**
 * Demo content for NeonLens Studio. Replace it with your own business details, real projects and
 * real reviews before launch — never publish invented testimonials on a live site.
 */

export const settings = {
  businessName: 'NeonLens Studio',
  tagline: 'Wedding & brand photography and film',
  description:
    'NeonLens is a photo and video studio in Cluj-Napoca creating cinematic wedding photography, wedding films and brand content across Transylvania and Romania.',
  email: 'hello@neonlens.studio',
  phone: '+40 712 345 678',
  whatsapp: '40712345678',
  address: { street: 'Strada Memorandumului 28', city: 'Cluj-Napoca', region: 'Cluj', postalCode: '400114', country: 'RO' },
  geo: { lat: 46.7699, lng: 23.5896 },
  priceRange: '€€',
  currency: 'EUR',
  foundingYear: 2017,
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const, opens: '10:00', closes: '18:00' },
  ],
  stats: [
    { value: '320+', label: 'Weddings filmed' },
    { value: '9 yrs', label: 'Behind the lens' },
    { value: '4.9★', label: 'Average rating' },
    { value: '72h', label: 'Sneak peek delivery' },
  ],
  about: {
    heading: 'Two storytellers, one camera bag that is far too heavy.',
    body: `NeonLens started in 2017 when a documentary photographer and a music-video director decided weddings deserved the same care as film sets.

Today we are a small crew of four based in Cluj-Napoca. We plan every shoot like a production — shot lists, light studies, backup gear — and then on the day we get out of the way and let real moments happen.

We work with couples who want honest, cinematic images and with brands who need content that actually stops the scroll.`,
    founderName: 'Andrei & Ioana',
    founderRole: 'Founders',
  },
  social: {
    instagram: 'https://instagram.com/neonlens.studio',
    youtube: 'https://youtube.com/@neonlensstudio',
    tiktok: 'https://tiktok.com/@neonlens.studio',
    facebook: 'https://facebook.com/neonlens.studio',
  },
  googleBusinessProfileUrl: '',
  googleReviewUrl: '',
  generalFaqs: [
    { question: 'How far in advance should we book?', answer: 'Peak wedding season (May–September) books 12–18 months ahead. Brand and event shoots usually need 2–4 weeks. Check your date with the inquiry form — we reply within 24 hours.' },
    { question: 'How much is the deposit and how do I pay it?', answer: 'A 30% deposit reserves your date. You can pay it online by card, Apple Pay or Google Pay when you book; the balance is due 14 days before the shoot.' },
    { question: 'Do you travel outside Cluj-Napoca?', answer: 'Yes — we regularly shoot in Bucharest, Brașov, Sibiu and abroad. Travel fees are shown in the quote calculator for each city.' },
    { question: 'When will we receive our photos and film?', answer: 'You get a sneak peek within 72 hours, the full photo gallery within 4–6 weeks and the edited film within 8–10 weeks.' },
    { question: 'Can we choose which photos are edited?', answer: 'Yes. You receive a private online gallery where you mark favourites and leave notes; we use your selection for the album and any extra retouching.' },
    { question: 'Do you have backup equipment?', answer: 'Always. Every camera records to two cards, we carry spare bodies and lenses, and footage is backed up to three locations the same night.' },
  ],
}

export const homepage = {
  heroEyebrow: 'Photo & film · Cluj-Napoca',
  heroHeading: 'Wedding & brand stories, shot like cinema.',
  heroSubheading:
    'We are NeonLens — a photo and video crew from Cluj-Napoca creating honest, cinematic images for couples and brands across Romania.',
  process: [
    { title: 'Say hello', description: 'Send a quick inquiry or WhatsApp. We confirm availability and send a tailored quote within 24 hours.' },
    { title: 'Plan it together', description: 'A video call to learn your story, then a shot list, timeline and location scouting.' },
    { title: 'Shoot day', description: 'A calm, experienced crew that blends in. Backup gear for everything.' },
    { title: 'Your gallery', description: 'Sneak peek in 72 hours. Full private gallery to favourite, download and share.' },
  ],
}

export const services = [
  {
    key: 'wedding-photo',
    title: 'Wedding Photography',
    category: 'photo',
    order: 1,
    tagline: 'Honest, cinematic wedding photos',
    excerpt: 'Documentary-style wedding photography that captures the day exactly as it felt — from getting ready to the last dance.',
    intro: `Your wedding passes in a blur. Our job is to slow it down: the nervous laugh before the ceremony, your grandmother's face during the vows, the chaos of the dance floor at 2am.

We photograph weddings in a documentary style with an editorial eye. Minimal posing, lots of real moments, and a handful of beautifully lit portraits when the light is at its best.

Every wedding includes a pre-wedding planning call, a timeline built around the best light, two cards in every camera and a private online gallery to share with your guests.`,
    highlights: [
      { title: 'Two photographers', description: 'Both sides of every moment — his and her preparations, ceremony angles and candid guest reactions.' },
      { title: 'Sneak peek in 72 hours', description: '30–50 edited favourites to share while the memories are fresh.' },
      { title: 'Private online gallery', description: 'Favourite, download and share with family. Print shop included.' },
      { title: 'Light-first timeline', description: 'We plan portraits around golden hour, not around guesswork.' },
      { title: 'Fully backed-up', description: 'Dual-card cameras and three-location backup the same night.' },
      { title: 'Album design', description: 'Handmade Italian albums designed from your own selection.' },
    ],
    process: [
      { title: 'Discovery call', description: 'We get to know you, your venue and what matters most.' },
      { title: 'Timeline & shot list', description: 'Built together 4–6 weeks before the day.' },
      { title: 'Wedding day', description: 'Unobtrusive coverage from preparations to party.' },
      { title: 'Gallery & album', description: 'Sneak peek in 72 hours, full gallery in 4–6 weeks.' },
    ],
    startingPrice: 1200,
    packages: [
      { name: 'Essential', price: 1200, hours: 6, description: 'Ceremony, portraits and the first part of the party.', includes: ['1 photographer', '6 hours coverage', '400+ edited photos', 'Online gallery'] },
      { name: 'Signature', price: 1900, hours: 10, popular: true, description: 'Our most-booked wedding package.', includes: ['2 photographers', '10 hours coverage', '700+ edited photos', 'Sneak peek in 72h', 'Online gallery', 'Engagement session'] },
      { name: 'Complete', price: 2800, hours: 14, description: 'Everything, from preparations to the last song, plus an album.', includes: ['2 photographers', '14 hours coverage', '900+ edited photos', '30×30 fine-art album', 'Engagement session', 'Next-day sneak peek'] },
    ],
    faqs: [
      { question: 'How many photos will we receive?', answer: 'Typically 60–80 edited photos per hour of coverage — roughly 700+ for a full day with two photographers.' },
      { question: 'Do you give us all the RAW files?', answer: 'We deliver every good frame fully edited in high resolution. RAW files are not included because the edit is part of our style.' },
    ],
    keywords: ['wedding photographer cluj', 'fotograf nunta cluj', 'documentary wedding photography'],
  },
  {
    key: 'wedding-film',
    title: 'Wedding Videography',
    category: 'video',
    order: 2,
    tagline: 'Wedding films you will rewatch every anniversary',
    excerpt: 'Cinematic wedding films with real audio from your vows and speeches — a 4–6 minute highlight film plus the full ceremony.',
    intro: `A wedding film is the only way to hear your vows again, see your dad's speech, and relive the dance floor exactly as it was.

We film with cinema cameras, record clean audio from the officiant and speeches, and edit like a short film — music licensed properly, colour graded by hand.

Every film package includes a highlight film for social media, the full ceremony and speeches, and delivery through your private online gallery.`,
    highlights: [
      { title: 'Highlight film', description: '4–6 minute cinematic edit with licensed music.' },
      { title: 'Clean audio', description: 'Wireless mics on the couple and officiant, plus a recorder on the speeches.' },
      { title: 'Drone footage', description: 'Licensed drone pilot where the venue allows it.' },
      { title: 'Vertical teaser', description: 'A 60-second 9:16 cut for Instagram and TikTok within a week.' },
    ],
    process: [
      { title: 'Story call', description: 'We talk about pace, music taste and the moments you care about.' },
      { title: 'Audio & timeline plan', description: 'Coordinated with your planner and DJ.' },
      { title: 'Filming day', description: 'Two filmmakers, cinema cameras, gimbals and drone.' },
      { title: 'Edit & delivery', description: 'Teaser in a week, full film in 8–10 weeks.' },
    ],
    startingPrice: 1500,
    packages: [
      { name: 'Highlights', price: 1500, hours: 8, description: 'A beautiful highlight film of the day.', includes: ['1 filmmaker', '8 hours coverage', '4–6 min highlight film', 'Licensed music'] },
      { name: 'Story', price: 2400, hours: 12, popular: true, description: 'Highlight film plus the full ceremony and speeches.', includes: ['2 filmmakers', '12 hours coverage', 'Highlight film', 'Full ceremony & speeches', 'Vertical teaser', 'Drone'] },
      { name: 'Feature', price: 3400, hours: 14, description: 'A 15–20 minute documentary edit of your day.', includes: ['2 filmmakers', '14 hours coverage', '15–20 min feature film', 'Highlight film', 'Full ceremony & speeches', 'Drone'] },
    ],
    faqs: [
      { question: 'Can we choose the music?', answer: 'Yes — you pick a mood or specific tracks from our licensed library so the film can be posted online without copyright blocks.' },
    ],
    keywords: ['wedding videographer cluj', 'videograf nunta', 'wedding film romania'],
  },
  {
    key: 'brand-video',
    title: 'Brand & Commercial Video',
    category: 'video',
    order: 3,
    tagline: 'Video content that stops the scroll',
    excerpt: 'Brand films, social ads, product launches and testimonial videos for companies that want to look as good as they are.',
    intro: `Great brand content starts with a clear brief. We help you shape the message, then handle everything from scripting and casting to filming, editing and the 9:16 cuts your social team actually needs.

We have produced launch films for tech start-ups, recruitment videos for factories and Reels campaigns for restaurants and hotels.

You get one crew for photo and video, so the stills and the film always match.`,
    highlights: [
      { title: 'Concept & script', description: 'We turn a loose idea into a shot-by-shot plan.' },
      { title: 'All the formats', description: '16:9 hero film plus 9:16 and 1:1 cuts for every platform.' },
      { title: 'Photo + video in one day', description: 'Matching stills from the same set.' },
      { title: 'Fast turnaround', description: 'First edit in 7 working days.' },
    ],
    process: [
      { title: 'Brief', description: 'Goals, audience, channels and deadline.' },
      { title: 'Pre-production', description: 'Script, storyboard, locations, talent.' },
      { title: 'Shoot', description: 'Lean crew, cinema cameras, lighting and audio.' },
      { title: 'Post', description: 'Edit, colour, sound design and two rounds of revisions.' },
    ],
    startingPrice: 900,
    packages: [
      { name: 'Social pack', price: 900, hours: 4, description: 'Half-day shoot for short-form content.', includes: ['Half-day shoot', '5 vertical videos', 'Subtitles', '1 revision round'] },
      { name: 'Brand film', price: 2500, hours: 8, popular: true, description: 'A 60–90 second hero film plus cut-downs.', includes: ['Concept & script', 'Full-day shoot', '60–90s hero film', '3 social cut-downs', '2 revision rounds'] },
      { name: 'Campaign', price: 5500, hours: 16, description: 'Multi-day production for launches and ads.', includes: ['Creative concept', '2 shoot days', 'Hero film', '10+ ad variations', 'Stills package'] },
    ],
    faqs: [
      { question: 'Do you issue invoices for companies?', answer: 'Yes, we invoice as a registered Romanian company and can work with purchase orders.' },
    ],
    keywords: ['video production cluj', 'brand video romania', 'corporate video cluj'],
  },
  {
    key: 'event-photo',
    title: 'Corporate & Event Photography',
    category: 'photo',
    order: 4,
    tagline: 'Conferences, launches and team portraits',
    excerpt: 'Fast, discreet event photography and consistent team headshots — with same-day selects for your social media.',
    intro: `Events move fast and so do we. We cover conferences, product launches, galas and company parties with a discreet, documentary approach — speakers, audience energy, networking and details.

Need content while the event is still on? We deliver same-day selects so your team can post in real time.

We also run on-site headshot studios so your whole team gets consistent, flattering portraits in a single afternoon.`,
    highlights: [
      { title: 'Same-day selects', description: '20–40 edited photos delivered during or right after the event.' },
      { title: 'On-site headshot studio', description: 'Up to 40 people per hour with consistent lighting.' },
      { title: 'Commercial licence', description: 'Use the photos in marketing, PR and ads.' },
    ],
    process: [
      { title: 'Run-of-show', description: 'Agenda, key people and must-have shots.' },
      { title: 'Coverage', description: 'Discreet, fast and on schedule.' },
      { title: 'Delivery', description: 'Same-day selects, full gallery in 3 working days.' },
    ],
    startingPrice: 450,
    packages: [
      { name: 'Half day', price: 450, hours: 4, includes: ['4 hours coverage', '150+ edited photos', 'Delivery in 3 days'] },
      { name: 'Full day', price: 800, hours: 8, popular: true, includes: ['8 hours coverage', '300+ edited photos', 'Same-day selects', 'Commercial licence'] },
      { name: 'Headshot day', price: 950, hours: 6, includes: ['On-site studio', 'Up to 60 people', 'Retouched headshots', '48h delivery'] },
    ],
    faqs: [],
    keywords: ['event photographer cluj', 'corporate headshots cluj', 'conference photography romania'],
  },
  {
    key: 'product-photo',
    title: 'Product Photography',
    category: 'photo',
    order: 5,
    tagline: 'E-commerce and lifestyle product photos that sell',
    excerpt: 'Clean white-background packshots and styled lifestyle images for online shops, Amazon listings and ads.',
    intro: `Your product photos are your shop window. We shoot consistent, colour-accurate packshots on white for marketplaces, and styled lifestyle images that show your product in context.

Everything is shot tethered so you can approve images live, and files are delivered in every size your store and ad platforms need.`,
    highlights: [
      { title: 'Marketplace-ready', description: 'Pure white backgrounds that pass Amazon and eMAG requirements.' },
      { title: 'Colour accuracy', description: 'Calibrated workflow so products look exactly like the real thing.' },
      { title: 'Lifestyle sets', description: 'Styled scenes, props and models on request.' },
    ],
    process: [
      { title: 'Shot list', description: 'Angles, crops and formats agreed up front.' },
      { title: 'Studio day', description: 'Tethered shooting with live approval.' },
      { title: 'Retouching', description: 'Dust, reflections and colour corrected.' },
    ],
    startingPrice: 300,
    packages: [
      { name: 'Starter', price: 300, hours: 2, includes: ['Up to 10 products', '3 angles each', 'White background'] },
      { name: 'Catalogue', price: 750, hours: 6, popular: true, includes: ['Up to 40 products', '3 angles each', 'White background', '10 lifestyle shots'] },
      { name: 'Campaign', price: 1600, hours: 8, includes: ['Styled lifestyle sets', 'Model on request', 'Ad-ready crops'] },
    ],
    faqs: [],
    keywords: ['product photography cluj', 'fotograf produs', 'ecommerce photography romania'],
  },
] as const

export const locations = [
  {
    key: 'cluj',
    name: 'Cluj-Napoca',
    region: 'Cluj County',
    isPrimary: true,
    travelFee: 0,
    geo: { lat: 46.7712, lng: 23.6236 },
    intro: `Cluj-Napoca is home. We know which side of Piața Unirii gets the best morning light, where the Botanical Garden is quiet on a Saturday afternoon and how to make the most of a rainy day in the old town.

Most of our weddings happen within an hour of the city — from manor houses in the Transylvanian hills to industrial lofts downtown — and there is never a travel fee within Cluj County.`,
    venues: [
      { name: 'Alexandru Borza Botanical Garden', description: 'Japanese garden and greenhouses — beautiful for portraits, permit required.' },
      { name: 'Banffy Castle, Bonțida', description: 'Romantic ruins 30 minutes from Cluj, stunning at golden hour.' },
      { name: 'Piața Unirii & the old town', description: 'Baroque facades and cobblestones for urban portraits.' },
      { name: 'Cetățuia Hill', description: 'Panoramic city views at sunset.' },
    ],
    nearbyAreas: ['Florești', 'Apahida', 'Turda', 'Gilău', 'Bonțida'],
    faqs: [
      { question: 'Is there a travel fee in Cluj-Napoca?', answer: 'No — travel within Cluj County is always included.' },
    ],
  },
  {
    key: 'bucharest',
    name: 'Bucharest',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 150,
    geo: { lat: 44.4268, lng: 26.1025 },
    intro: `We shoot in Bucharest most months of the year — weddings at the lake-side venues in the north, brand shoots for start-ups in Pipera and events at the Palace of Parliament.

The city's mix of Belle Époque architecture and brutalist blocks makes for striking editorial portraits, and we know the spots that are quiet enough for a calm session.`,
    venues: [
      { name: 'Cișmigiu Gardens', description: 'Classic lakeside park in the centre, lovely in autumn.' },
      { name: 'Romanian Athenaeum', description: 'Iconic neoclassical concert hall for elegant portraits.' },
      { name: 'Snagov lake venues', description: 'Garden weddings 40 minutes north of the city.' },
    ],
    nearbyAreas: ['Ilfov', 'Snagov', 'Otopeni', 'Voluntari'],
    faqs: [],
  },
  {
    key: 'brasov',
    name: 'Brașov',
    region: 'Brașov County',
    isPrimary: false,
    travelFee: 80,
    geo: { lat: 45.6427, lng: 25.5887 },
    intro: `Mountains, medieval streets and castles — Brașov is one of our favourite places for destination-style weddings and adventurous elopements.

We plan around mountain weather, know the best viewpoints over the Old Town and work regularly at the chalet venues in Poiana Brașov.`,
    venues: [
      { name: 'Council Square & Black Church', description: 'Medieval old-town backdrop.' },
      { name: 'Tâmpa Mountain', description: 'Sunset views over the city.' },
      { name: 'Poiana Brașov chalets', description: 'Mountain-lodge weddings with alpine views.' },
    ],
    nearbyAreas: ['Poiana Brașov', 'Râșnov', 'Bran', 'Sinaia'],
    faqs: [],
  },
  {
    key: 'sibiu',
    name: 'Sibiu',
    region: 'Sibiu County',
    isPrimary: false,
    travelFee: 60,
    geo: { lat: 45.7983, lng: 24.1256 },
    intro: `Sibiu's pastel squares and the "eyes" on its rooftops make it one of the most photogenic cities in Romania.

We love the Saxon villages and fortified churches nearby for intimate weddings, and the old town for engagement sessions any time of year.`,
    venues: [
      { name: 'Piața Mare & Bridge of Lies', description: 'Colourful old-town squares.' },
      { name: 'Saxon fortified churches', description: 'UNESCO villages within an hour.' },
      { name: 'Păltiniș', description: 'Mountain resort for winter sessions.' },
    ],
    nearbyAreas: ['Cisnădie', 'Mediaș', 'Păltiniș'],
    faqs: [],
  },
] as const

export const testimonials = [
  { key: 't1', name: 'Ana & Mihai', role: 'Wedding at Banffy Castle', service: 'wedding-photo', rating: 5, featured: true, quote: 'We have looked at our gallery every day since. They caught moments we did not even know happened — my dad crying during the first dance still gets me.' },
  { key: 't2', name: 'Elena & Radu', role: 'Wedding film, Brașov', service: 'wedding-film', rating: 5, featured: true, quote: 'The film is unreal. Hearing our vows again with that mountain footage… our whole family has watched it a dozen times.' },
  { key: 't3', name: 'Cristina Pop', role: 'Marketing Lead, Fintech start-up', service: 'brand-video', rating: 5, featured: true, quote: 'Brief on Monday, rough cut the next week, launch video live in two weeks. Our recruitment ads have never performed better.' },
  { key: 't4', name: 'Bogdan Ilie', role: 'Event Manager, TechSummit', service: 'event-photo', rating: 5, featured: false, quote: 'Same-day selects meant our social team posted while people were still in the room. Professional and invisible.' },
  { key: 't5', name: 'Ioana & Alex', role: 'Wedding in Sibiu', service: 'wedding-photo', rating: 5, featured: false, quote: 'Calm, funny and so organised. The timeline they built saved our day when it started raining.' },
  { key: 't6', name: 'Maria Stan', role: 'Founder, ceramics brand', service: 'product-photo', rating: 5, featured: false, quote: 'Our conversion rate went up after we swapped in the new product photos. Colours are spot on.' },
  { key: 't7', name: 'Diana & Paul', role: 'Wedding in Bucharest', service: 'wedding-film', rating: 4, featured: false, quote: 'Beautiful film and great communication. Would have loved it a bit sooner, but worth the wait.' },
] as const

export const projects = [
  {
    key: 'p1', title: 'Ana & Mihai — Golden hour at Banffy Castle', service: 'wedding-photo', location: 'cluj', venue: 'Banffy Castle, Bonțida', clientType: 'Couple', date: '2026-06-14', featured: true, testimonial: 't1',
    excerpt: 'A relaxed summer wedding in the ruins of Banffy Castle, with a ceremony at sunset and a party under string lights.',
    brief: 'Ana and Mihai wanted documentary photos that felt like their friends had taken them — but better. No stiff group shots, lots of candid moments, and a few portraits in the castle ruins at golden hour.',
    approach: `## Planning around the light
We moved the ceremony 40 minutes later so the couple walked out of the chapel straight into golden hour. A quick scouting visit two weeks before told us exactly where the sun would fall through the ruined windows.

## Two photographers, two stories
- One of us stayed with the guests during cocktail hour
- The other took the couple for a 15-minute portrait walk
- We reunited for speeches and the first dance`,
    result: 'Ana and Mihai received 780 edited photos and a 72-hour sneak peek that they used for their thank-you cards. Their gallery was viewed over 3,000 times by family and friends.',
    deliverables: ['780 edited photos', '72h sneak peek', '30×30 album'], tags: ['castle', 'summer', 'golden hour'],
  },
  {
    key: 'p2', title: 'Elena & Radu — A mountain wedding film in Poiana Brașov', service: 'wedding-film', location: 'brasov', venue: 'Poiana Brașov', clientType: 'Couple', date: '2026-09-05', featured: true, testimonial: 't2',
    excerpt: 'A cinematic wedding film with drone shots over the Carpathians and vows recorded in crystal-clear audio.',
    brief: 'Elena and Radu wanted a film that felt like a movie trailer — epic landscapes — but also the intimate audio of their handwritten vows.',
    approach: `## Sound first
We put wireless lavalier mics on both of them and the officiant, and recorded the speeches straight from the DJ desk.

## Drone and gimbal
A licensed drone pilot captured the mountains at sunrise, and we used gimbals for the long walking shots through the forest.`,
    result: 'A 5-minute highlight film, a 22-minute documentary edit and a vertical teaser that reached 40,000 views on Instagram.',
    deliverables: ['5 min highlight film', '22 min documentary edit', '60s vertical teaser'], tags: ['mountains', 'drone', 'film'],
  },
  {
    key: 'p3', title: 'Fintech launch film — 90 seconds that hired 20 engineers', service: 'brand-video', location: 'cluj', venue: 'Office & rooftop, Cluj-Napoca', clientType: 'Tech start-up', date: '2026-04-20', featured: true, testimonial: 't3',
    excerpt: 'A recruitment and launch film for a Cluj fintech start-up, with matching stills and social cut-downs.',
    brief: 'The team needed a recruitment film that showed the real people behind the product — no stock footage, no corporate clichés — ready for a launch in three weeks.',
    approach: `## Interviews as the backbone
We interviewed five engineers on camera, then built the film around their own words.

## One day, two outputs
While the video crew filmed, our photographer shot new team portraits and office lifestyle photos for the careers page.`,
    result: 'The hero film plus five 9:16 cut-downs ran as LinkedIn and Instagram ads. The company filled 20 engineering roles in the following quarter.',
    deliverables: ['90s hero film', '5 vertical cut-downs', '60 team photos'], tags: ['recruitment', 'startup', 'linkedin'],
  },
  {
    key: 'p4', title: 'TechSummit 2026 — 1,200 attendees, same-day delivery', service: 'event-photo', location: 'cluj', venue: 'BT Arena, Cluj-Napoca', clientType: 'Conference', date: '2026-05-12', featured: false, testimonial: 't4',
    excerpt: 'Two-day conference coverage with live selects for the social team and a headshot studio for speakers.',
    brief: 'The organisers needed real-time photos for social media, high-quality speaker portraits, and a full gallery for sponsors within three days.',
    approach: `## A live pipeline
Our second shooter edited on site; selects were in the client's shared folder within 30 minutes of each keynote.

## Speaker studio
A pop-up studio backstage gave every speaker a consistent portrait for the post-event recap.`,
    result: '1,100 edited photos, 45 speaker portraits and more than 200 images posted during the event itself.',
    deliverables: ['1,100 edited photos', '45 speaker portraits', 'Live selects'], tags: ['conference', 'live'],
  },
  {
    key: 'p5', title: 'Ioana & Alex — A rainy-day wedding in Sibiu', service: 'wedding-photo', location: 'sibiu', venue: 'Old town, Sibiu', clientType: 'Couple', date: '2025-10-11', featured: true, testimonial: 't5',
    excerpt: 'When the forecast said 100% rain we leaned in: umbrellas, reflections and moody old-town portraits.',
    brief: 'An intimate wedding of 60 guests in Sibiu old town. The couple were worried about the forecast and wanted a backup plan that still felt special.',
    approach: `## Plan B was the best plan
We scouted covered arcades and cafés the day before, packed clear umbrellas and used the wet cobblestones for reflections.`,
    result: 'Some of our favourite portraits ever. The couple say the rain is now their favourite part of the story.',
    deliverables: ['520 edited photos', 'Sneak peek in 48h'], tags: ['rain', 'intimate', 'old town'],
  },
  {
    key: 'p6', title: 'Handmade ceramics — catalogue and lifestyle shoot', service: 'product-photo', location: 'cluj', venue: 'NeonLens studio', clientType: 'E-commerce brand', date: '2026-02-08', featured: false, testimonial: 't6',
    excerpt: '40 products on white plus styled lifestyle scenes for an independent ceramics brand.',
    brief: 'A growing ceramics brand needed consistent packshots for its new online shop and eMAG listing, plus lifestyle images for Instagram.',
    approach: `## Tethered and colour-calibrated
Every glaze was checked against the physical piece on a calibrated monitor before we moved on.`,
    result: 'The shop relaunched with the new images and conversion rate improved noticeably in the first month.',
    deliverables: ['120 packshots', '15 lifestyle images'], tags: ['ecommerce', 'ceramics'],
  },
  {
    key: 'p7', title: 'Diana & Paul — A lakeside wedding film near Bucharest', service: 'wedding-film', location: 'bucharest', venue: 'Snagov', clientType: 'Couple', date: '2025-08-23', featured: false, testimonial: 't7',
    excerpt: 'A warm summer film on the shores of Lake Snagov with a boat entrance and fireworks finale.',
    brief: 'Diana and Paul wanted a joyful, fast-paced film that captured the party energy of their 200-guest wedding.',
    approach: `## Energy in the edit
We shot high-frame-rate footage on the dance floor and cut the film to the band's own live recording.`,
    result: 'A 6-minute highlight film and full speeches edit, shared by the couple with family in four countries.',
    deliverables: ['6 min highlight film', 'Speeches edit'], tags: ['lake', 'party', 'summer'],
  },
  {
    key: 'p8', title: 'Boutique hotel — rooms, food and Reels in one day', service: 'brand-video', location: 'brasov', venue: 'Old Town, Brașov', clientType: 'Hospitality', date: '2026-03-15', featured: false, testimonial: null,
    excerpt: 'Photo and short-form video content for a boutique hotel relaunch in Brașov old town.',
    brief: 'A 20-room hotel was relaunching after renovation and needed photos for booking platforms plus a month of Reels.',
    approach: `## Shot list by platform
We planned every shot by destination — Booking.com, website hero, Instagram grid, Reels — so nothing was wasted.`,
    result: 'Direct bookings increased and the Reels series became the hotel’s best-performing content to date.',
    deliverables: ['80 photos', '12 Reels', 'Website hero video'], tags: ['hotel', 'reels'],
  },
] as const

export const posts = [
  {
    key: 'b1',
    title: 'How much does a wedding photographer cost in Cluj-Napoca? (2026 prices)',
    category: 'pricing',
    publishedAt: '2026-09-02',
    services: ['wedding-photo'],
    location: 'cluj',
    excerpt: 'Real 2026 price ranges for wedding photography in Cluj, what drives the cost, and how to compare quotes fairly.',
    content: `Wedding photography prices in Cluj-Napoca vary a lot — from €500 to more than €3,000 — and it is not always obvious why. Here is an honest breakdown from a studio that quotes dozens of weddings every month.

## Typical price ranges in 2026
- **€500–€900:** one photographer, 4–6 hours, often newer to weddings
- **€1,000–€2,000:** experienced photographer or team of two, full day, online gallery
- **€2,000–€3,500+:** established studios, two photographers, albums, engagement sessions

## What actually drives the price
Hours of coverage and number of photographers are the biggest factors. After that comes editing time — a full wedding is typically 40–60 hours of work after the day itself — plus albums, travel and the season.

## How to compare quotes fairly
Ask every photographer for a **full wedding gallery**, not just highlights. Check how many edited photos you get, when you get them, and whether backup equipment and a contract are included.

## Our prices
Our wedding packages start at €1,200. You can build your own estimate in under a minute with our quote calculator.`,
    faqs: [
      { question: 'Is a second photographer worth it?', answer: 'For weddings over 80 guests or with separate preparations, yes — you get both sides of every moment and many more candid guest photos.' },
    ],
  },
  {
    key: 'b2',
    title: 'How much does a wedding videographer cost in Romania?',
    category: 'pricing',
    publishedAt: '2026-08-18',
    services: ['wedding-film'],
    location: null,
    excerpt: 'Wedding film prices across Romania in 2026, what is included at each level, and the questions to ask before you book.',
    content: `A wedding film is the only way to hear your vows again. But prices range from €600 to €5,000. Here is what you get at each level.

## Price ranges
- **€600–€1,200:** one filmmaker, highlight film only
- **€1,500–€2,500:** two filmmakers, highlight film plus ceremony and speeches
- **€3,000+:** documentary-length film, drone, multiple edits

## Audio is everything
Ask how vows and speeches are recorded. Without wireless mics on the couple and officiant, the most emotional moments are often lost.

## Music licensing
Films with unlicensed music get muted on Instagram and YouTube. Make sure your videographer uses a licensed library.`,
    faqs: [],
  },
  {
    key: 'b3',
    title: 'The 10 best photo spots in Cluj-Napoca for weddings and engagements',
    category: 'venues',
    publishedAt: '2026-07-10',
    services: ['wedding-photo'],
    location: 'cluj',
    excerpt: 'Our favourite locations around Cluj for portraits — with the best time of day and permit tips for each.',
    content: `After hundreds of sessions around Cluj, these are the spots we keep coming back to.

## In the city
- **Botanical Garden** — the Japanese garden is magical; you need a photo permit
- **Piața Unirii** — best early morning before the crowds
- **Cetățuia Hill** — sunset over the whole city
- **Central Park & the Casino** — classic and easy to reach

## Within an hour
- **Banffy Castle, Bonțida** — romantic ruins, golden hour
- **Turda Gorge** — dramatic cliffs for adventurous couples
- **Salina Turda** — the salt mine, a truly unique backdrop

## Tips
Always check permit rules, plan for golden hour, and have a rain plan. We help every couple choose locations that fit their timeline.`,
    faqs: [
      { question: 'Do we need a permit to shoot in the Botanical Garden?', answer: 'Yes. The garden charges a photo fee; we arrange it in advance for our couples.' },
    ],
  },
  {
    key: 'b4',
    title: 'How to brief a brand video (and get what you actually need)',
    category: 'guides',
    publishedAt: '2026-06-01',
    services: ['brand-video'],
    location: null,
    excerpt: 'A simple one-page brief template for marketing teams commissioning video for the first time.',
    content: `The difference between a video that performs and one that sits unused is usually the brief, not the camera.

## The one-page brief
- **Goal:** what should viewers do after watching?
- **Audience:** who exactly is watching, and where?
- **Message:** one sentence the viewer must remember
- **Formats:** 16:9, 9:16, 1:1 — and lengths for each
- **Deadline and budget**

## Plan the cut-downs first
Most views happen on phones. Decide your vertical edits before the shoot so we can frame for them.`,
    faqs: [],
  },
  {
    key: 'b5',
    title: 'Product photography checklist for e-commerce shops',
    category: 'guides',
    publishedAt: '2026-05-12',
    services: ['product-photo'],
    location: null,
    excerpt: 'Everything to prepare before a product shoot so your images pass marketplace rules and convert.',
    content: `Good product photos are planned before anyone picks up a camera.

## Before the shoot
- Clean, label-free samples of every variant
- A list of angles and crops each platform needs
- Brand colour references for accurate reproduction

## Marketplace rules
Amazon and eMAG require a pure white background (RGB 255,255,255) for the main image and the product filling around 85% of the frame.

## Lifestyle images
Show scale and use. One good lifestyle photo often answers questions that would otherwise lead to returns.`,
    faqs: [],
  },
] as const

export const pricing = {
  depositPercent: 30,
  estimateSpreadPercent: 10,
  rates: [
    { service: 'wedding-photo', baseFee: 400, hourlyRate: 140, minHours: 4, maxHours: 14 },
    { service: 'wedding-film', baseFee: 600, hourlyRate: 160, minHours: 6, maxHours: 14 },
    { service: 'brand-video', baseFee: 450, hourlyRate: 150, minHours: 2, maxHours: 16 },
    { service: 'event-photo', baseFee: 100, hourlyRate: 90, minHours: 2, maxHours: 12 },
    { service: 'product-photo', baseFee: 100, hourlyRate: 100, minHours: 2, maxHours: 8 },
  ],
  addOns: [
    { name: 'Second photographer', price: 50, unit: 'perHour', services: ['wedding-photo', 'event-photo'] },
    { name: 'Second filmmaker', price: 60, unit: 'perHour', services: ['wedding-film', 'brand-video'] },
    { name: 'Drone footage', price: 250, unit: 'flat', services: ['wedding-film', 'brand-video'] },
    { name: 'Engagement session', price: 250, unit: 'flat', services: ['wedding-photo'] },
    { name: 'Fine-art album 30×30', price: 450, unit: 'flat', services: ['wedding-photo'] },
    { name: 'Vertical teaser (9:16)', price: 150, unit: 'flat', services: ['wedding-film'] },
    { name: 'Same-day selects', price: 150, unit: 'flat', services: ['event-photo'] },
    { name: 'Extra social cut-downs (×5)', price: 300, unit: 'flat', services: ['brand-video'] },
    { name: 'Lifestyle styling & props', price: 200, unit: 'flat', services: ['product-photo'] },
  ],
} as const
