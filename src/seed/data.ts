/**
 * Demo content for NeonLens Studio (Bucharest & Ilfov). Replace it with your own business details, real
 * projects and real reviews before launch — never publish invented testimonials on a live site.
 * The Romanian locale mirrors this file 1:1 in ./data.ro.ts — keep both in the same shape.
 */

export const settings = {
  businessName: 'NeonLens Studio',
  tagline: 'Wedding & brand photographer and videographer in Bucharest',
  description:
    'NeonLens is a photo and video studio in Bucharest creating cinematic wedding photography, wedding films and brand content across Bucharest, Ilfov County and the lakes and palaces around the capital.',
  email: 'hello@neonlens.studio',
  phone: '+40 712 345 678',
  whatsapp: '40712345678',
  // NAP (name, address, phone) stays in Romanian in every language: it must match the Google Business Profile exactly.
  address: { street: 'Strada Paris 45, Sector 1', city: 'București', region: 'București', postalCode: '011814', country: 'RO' },
  geo: { lat: 44.4396, lng: 26.0963 },
  priceRange: '€€',
  currency: 'EUR',
  foundingYear: 2017,
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const, opens: '10:00', closes: '18:00' },
  ],
  stats: [
    { value: '320+', label: 'Weddings in Bucharest & Ilfov' },
    { value: '9 yrs', label: 'Behind the lens' },
    { value: '4.9★', label: 'Average rating' },
    { value: '72h', label: 'Sneak peek delivery' },
  ],
  about: {
    heading: 'Two Bucharest storytellers, one camera bag that is far too heavy.',
    body: `NeonLens started in 2017 when a documentary photographer and a music-video director, both born and raised in Bucharest, decided weddings deserved the same care as film sets.

Today we are a small crew of four with a studio in Sector 1, a few minutes from Piața Victoriei. We know this city by heart — how long Kiseleff takes on a Saturday afternoon, when the light is softest in Herăstrău, which side of Lake Snagov catches the sunset. We plan every shoot like a production — shot lists, light studies, backup gear — and then on the day we get out of the way and let real moments happen.

We work with couples getting married in Bucharest and Ilfov who want honest, cinematic images, and with Bucharest brands who need content that actually stops the scroll.`,
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
    { question: 'How far in advance should we book?', answer: 'Saturdays in peak wedding season (May–September) in Bucharest and Ilfov book 12–18 months ahead. Brand and event shoots usually need 2–4 weeks. Check your date with the inquiry form — we reply within 24 hours.' },
    { question: 'How much is the deposit and how do I pay it?', answer: 'A 30% deposit reserves your date. You can pay it online by card, Apple Pay or Google Pay when you book; the balance is due 14 days before the shoot.' },
    { question: 'Do you charge travel fees in Bucharest and Ilfov?', answer: 'No. We cover all of Bucharest and Ilfov County — Snagov, Corbeanca, Mogoșoaia, Otopeni, Voluntari, Pipera and everywhere in between — at no travel fee. For venues more than about 40 km from the city, a small fee is shown in the quote calculator.' },
    { question: 'When will we receive our photos and film?', answer: 'You get a sneak peek within 72 hours, the full photo gallery within 4–6 weeks and the edited film within 8–10 weeks.' },
    { question: 'Can we choose which photos are edited?', answer: 'Yes. You receive a private online gallery where you mark favourites and leave notes; we use your selection for the album and any extra retouching.' },
    { question: 'What if we get stuck in Bucharest traffic on the day?', answer: 'We build traffic buffers into every timeline, leave early for venues in Ilfov and always arrive before you do. Every camera also records to two cards and we carry spare bodies and lenses, so nothing is left to chance.' },
  ],
}

export const homepage = {
  heroEyebrow: 'Photo & film · Bucharest & Ilfov',
  heroHeading: 'Wedding & brand photographer and videographer in Bucharest',
  heroSubheading:
    'We are NeonLens — a photo and video crew based in Bucharest, creating honest, cinematic images for couples and brands across the capital, Ilfov County and the lakes around Snagov.',
  process: [
    { title: 'Say hello', description: 'Send a quick inquiry or WhatsApp. We confirm availability and send a tailored quote within 24 hours.' },
    { title: 'Plan it together', description: 'A call or a coffee in Bucharest to learn your story, then a shot list, timeline and location scouting in the city or in Ilfov.' },
    { title: 'Shoot day', description: 'A calm, experienced crew that blends in — with traffic buffers built in and backup gear for everything.' },
    { title: 'Your gallery', description: 'Sneak peek in 72 hours. Full private gallery to favourite, download and share.' },
  ],
}

export const services = [
  {
    key: 'wedding-photo',
    slug: 'wedding-photography',
    title: 'Wedding Photography',
    seo: {
      title: 'Wedding Photographer Bucharest & Ilfov | NeonLens',
      description: 'Documentary wedding photographer in Bucharest and Ilfov. Two photographers, a 72h sneak peek and a private gallery. Packages from €1,200. Check your date.',
    },
    category: 'photo',
    order: 1,
    tagline: 'Honest, cinematic wedding photos in Bucharest and Ilfov',
    excerpt: 'Documentary-style wedding photography in Bucharest and Ilfov that captures the day exactly as it felt — from getting ready to the last dance.',
    intro: `Your wedding passes in a blur. Our job is to slow it down: the nervous laugh before the civil ceremony, your grandmother's face in church, the chaos of the dance floor at 2am in a ballroom in Ilfov.

We photograph weddings in Bucharest and the surrounding area in a documentary style with an editorial eye. Minimal posing, lots of real moments, and a handful of beautifully lit portraits — in the Old Town, in Herăstrău Park or by the lake at Snagov — when the light is at its best.

Every wedding includes a planning call, a timeline built around the best light and realistic Bucharest traffic, two cards in every camera and a private online gallery to share with your guests.`,
    highlights: [
      { title: 'Two photographers', description: 'Both sides of every moment — two sets of preparations across the city, church and civil ceremony angles, candid guest reactions.' },
      { title: 'Sneak peek in 72 hours', description: '30–50 edited favourites to share while the memories are fresh.' },
      { title: 'Private online gallery', description: 'Favourite, download and share with family. Print shop included.' },
      { title: 'Light-first timeline', description: 'We plan portraits around golden hour — and around the Saturday traffic between Bucharest and your venue.' },
      { title: 'Fully backed-up', description: 'Dual-card cameras and three-location backup the same night.' },
      { title: 'Album design', description: 'Handmade Italian albums designed from your own selection.' },
    ],
    process: [
      { title: 'Discovery call', description: 'We get to know you, your venue and what matters most.' },
      { title: 'Timeline & locations', description: 'Built together 4–6 weeks before the day, with portrait spots near your venue.' },
      { title: 'Wedding day', description: 'Unobtrusive coverage from preparations to party, anywhere in Bucharest or Ilfov.' },
      { title: 'Gallery & album', description: 'Sneak peek in 72 hours, full gallery in 4–6 weeks.' },
    ],
    startingPrice: 1200,
    packages: [
      { name: 'Essential', price: 1200, hours: 6, description: 'Civil ceremony or church, portraits and the first part of the party.', includes: ['1 photographer', '6 hours coverage', '400+ edited photos', 'Online gallery', 'No travel fee in Bucharest & Ilfov'] },
      { name: 'Signature', price: 1900, hours: 10, popular: true, description: 'Our most-booked wedding package in Bucharest.', includes: ['2 photographers', '10 hours coverage', '700+ edited photos', 'Sneak peek in 72h', 'Online gallery', 'Engagement session in Bucharest'] },
      { name: 'Complete', price: 2800, hours: 14, description: 'Everything, from preparations to the last song, plus an album.', includes: ['2 photographers', '14 hours coverage', '900+ edited photos', '30×30 fine-art album', 'Engagement session in Bucharest', 'Next-day sneak peek'] },
    ],
    faqs: [
      { question: 'How many photos will we receive?', answer: 'Typically 60–80 edited photos per hour of coverage — roughly 700+ for a full day with two photographers.' },
      { question: 'Can you cover preparations in two different parts of Bucharest?', answer: 'Yes. With two photographers we split up for the bride’s and groom’s preparations — even if one is in Sector 1 and the other in Voluntari — and meet again at the church or venue.' },
    ],
    keywords: ['wedding photographer Bucharest', 'fotograf nuntă București', 'wedding photographer Ilfov', 'documentary wedding photography Bucharest'],
  },
  {
    key: 'wedding-film',
    slug: 'wedding-videography',
    title: 'Wedding Videography',
    seo: {
      title: 'Wedding Videographer Bucharest & Ilfov | NeonLens',
      description: 'Cinematic wedding films in Bucharest, Snagov and all of Ilfov: clean audio of your vows, drone footage and a 4–6 min highlight film. From €1,500.',
    },
    category: 'video',
    order: 2,
    tagline: 'Wedding films from Bucharest you will rewatch every anniversary',
    excerpt: 'Cinematic wedding films in Bucharest and Ilfov with real audio from your vows and speeches — a 4–6 minute highlight film plus the full ceremony.',
    intro: `A wedding film is the only way to hear your vows again, see your dad's speech, and relive the dance floor exactly as it was.

We film weddings across Bucharest and Ilfov with cinema cameras — from palace courtyards in Mogoșoaia to lakeside gardens in Snagov — record clean audio from the officiant and speeches, and edit like a short film, with properly licensed music and colour graded by hand.

Every film package includes a highlight film for social media, the full ceremony and speeches, and delivery through your private online gallery.`,
    highlights: [
      { title: 'Highlight film', description: '4–6 minute cinematic edit with licensed music.' },
      { title: 'Clean audio', description: 'Wireless mics on the couple and officiant, plus a recorder on the speeches.' },
      { title: 'Drone footage', description: 'Licensed drone pilot over Snagov, Mogoșoaia and other Ilfov venues — Bucharest has strict no-fly zones, so we handle the permits.' },
      { title: 'Vertical teaser', description: 'A 60-second 9:16 cut for Instagram and TikTok within a week.' },
    ],
    process: [
      { title: 'Story call', description: 'We talk about pace, music taste and the moments you care about.' },
      { title: 'Audio & timeline plan', description: 'Coordinated with your planner, DJ or band and the venue.' },
      { title: 'Filming day', description: 'Two filmmakers, cinema cameras, gimbals and drone where allowed.' },
      { title: 'Edit & delivery', description: 'Teaser in a week, full film in 8–10 weeks.' },
    ],
    startingPrice: 1500,
    packages: [
      { name: 'Highlights', price: 1500, hours: 8, description: 'A beautiful highlight film of your day in Bucharest or Ilfov.', includes: ['1 filmmaker', '8 hours coverage', '4–6 min highlight film', 'Licensed music'] },
      { name: 'Story', price: 2400, hours: 12, popular: true, description: 'Highlight film plus the full ceremony and speeches.', includes: ['2 filmmakers', '12 hours coverage', 'Highlight film', 'Full ceremony & speeches', 'Vertical teaser', 'Drone (where permitted)'] },
      { name: 'Feature', price: 3400, hours: 14, description: 'A 15–20 minute documentary edit of your day.', includes: ['2 filmmakers', '14 hours coverage', '15–20 min feature film', 'Highlight film', 'Full ceremony & speeches', 'Drone (where permitted)'] },
    ],
    faqs: [
      { question: 'Can you fly a drone at our wedding in Bucharest?', answer: 'Central Bucharest and the area around Otopeni airport are restricted airspace, so drone shots in the city are rare. In most of Ilfov — Snagov, Corbeanca, Mogoșoaia — we can fly with the right permits, which we request for you.' },
    ],
    keywords: ['wedding videographer Bucharest', 'videograf nuntă București', 'filmare nuntă Snagov', 'wedding film Ilfov'],
  },
  {
    key: 'brand-video',
    slug: 'brand-video-production',
    title: 'Brand & Corporate Video',
    seo: {
      title: 'Brand & Corporate Video Bucharest | NeonLens',
      description: 'Corporate and brand video production in Bucharest: company presentation films, social ads and recruitment videos. Concept to final cut in 2 weeks.',
    },
    category: 'video',
    order: 3,
    tagline: 'Company videos for Bucharest brands that stop the scroll',
    excerpt: 'Company presentation films, social ads, product launches and testimonial videos for Bucharest businesses that want to look as good as they are.',
    intro: `Great brand content starts with a clear brief. We help you shape the message, then handle everything from scripting and casting to filming, editing and the 9:16 cuts your social team actually needs.

We have produced company presentation videos for offices in Pipera and Floreasca, recruitment films for tech start-ups, and Reels campaigns for restaurants and hotels across Bucharest and Ilfov.

You get one Bucharest crew for photo and video, so the stills and the film always match — and we can be at your office tomorrow morning.`,
    highlights: [
      { title: 'Concept & script', description: 'We turn a loose idea into a shot-by-shot plan.' },
      { title: 'All the formats', description: '16:9 hero film plus 9:16 and 1:1 cuts for every platform.' },
      { title: 'Photo + video in one day', description: 'Matching stills from the same set, in your office or on location in Bucharest.' },
      { title: 'Fast turnaround', description: 'First edit in 7 working days.' },
    ],
    process: [
      { title: 'Brief', description: 'Goals, audience, channels and deadline — in a meeting at your office or online.' },
      { title: 'Pre-production', description: 'Script, storyboard, Bucharest locations and filming permits, talent.' },
      { title: 'Shoot', description: 'Lean crew, cinema cameras, lighting and audio.' },
      { title: 'Post', description: 'Edit, colour, sound design and two rounds of revisions.' },
    ],
    startingPrice: 900,
    packages: [
      { name: 'Social pack', price: 900, hours: 4, description: 'Half-day shoot in Bucharest for short-form content.', includes: ['Half-day shoot', '5 vertical videos', 'Subtitles', '1 revision round'] },
      { name: 'Company film', price: 2500, hours: 8, popular: true, description: 'A 60–90 second company presentation film plus cut-downs.', includes: ['Concept & script', 'Full-day shoot', '60–90s hero film', '3 social cut-downs', '2 revision rounds'] },
      { name: 'Campaign', price: 5500, hours: 16, description: 'Multi-day production for launches and ads.', includes: ['Creative concept', '2 shoot days', 'Hero film', '10+ ad variations', 'Stills package'] },
    ],
    faqs: [
      { question: 'Do you issue invoices for companies?', answer: 'Yes, we invoice as a registered Romanian company based in Bucharest and can work with purchase orders and framework contracts.' },
    ],
    keywords: ['video production Bucharest', 'video prezentare firmă București', 'corporate video Bucharest', 'brand video Bucharest'],
  },
  {
    key: 'event-photo',
    slug: 'corporate-event-photography',
    title: 'Corporate & Event Photography',
    seo: {
      title: 'Corporate Event Photographer Bucharest | NeonLens',
      description: 'Corporate event photographer in Bucharest for conferences, launches and galas, plus on-site team headshots. Same-day selects for your social media.',
    },
    category: 'photo',
    order: 4,
    tagline: 'Conferences, launches and team portraits in Bucharest',
    excerpt: 'Fast, discreet event photography in Bucharest and consistent team headshots — with same-day selects for your social media.',
    intro: `Events move fast and so do we. We cover conferences at Romexpo and the big Bucharest hotels, product launches, galas and company parties with a discreet, documentary approach — speakers, audience energy, networking and details.

Need content while the event is still on? We deliver same-day selects so your team can post in real time.

We also set up headshot studios in offices from Pipera to the city centre, so your whole team gets consistent, flattering portraits in a single afternoon.`,
    highlights: [
      { title: 'Same-day selects', description: '20–40 edited photos delivered during or right after the event.' },
      { title: 'On-site headshot studio', description: 'Up to 40 people per hour with consistent lighting, in your Bucharest office.' },
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
      { name: 'Headshot day', price: 950, hours: 6, includes: ['Studio set up in your office', 'Up to 60 people', 'Retouched headshots', '48h delivery'] },
    ],
    faqs: [],
    keywords: ['corporate event photographer Bucharest', 'fotograf evenimente corporate București', 'conference photography Bucharest', 'corporate headshots Bucharest'],
  },
  {
    key: 'product-photo',
    slug: 'product-photography',
    title: 'Product Photography',
    seo: {
      title: 'Product Photography Bucharest | NeonLens Studio',
      description: 'Product photography studio in Bucharest: white-background packshots for eMAG and Amazon plus styled lifestyle images. Drop off products in Sector 1.',
    },
    category: 'photo',
    order: 5,
    tagline: 'E-commerce and lifestyle product photos that sell, shot in Bucharest',
    excerpt: 'Clean white-background packshots and styled lifestyle images for Bucharest online shops, marketplace listings and ads.',
    intro: `Your product photos are your shop window. In our Bucharest studio we shoot consistent, colour-accurate packshots on white for eMAG and Amazon, and styled lifestyle images that show your product in context.

Drop your products off at the studio in Sector 1 or send them by courier. Everything is shot tethered so you can approve images live, and files are delivered in every size your store and ad platforms need.`,
    highlights: [
      { title: 'Marketplace-ready', description: 'Pure white backgrounds that pass Amazon and eMAG requirements.' },
      { title: 'Colour accuracy', description: 'Calibrated workflow so products look exactly like the real thing.' },
      { title: 'Lifestyle sets', description: 'Styled scenes, props and models on request — in the studio or on location in Bucharest.' },
    ],
    process: [
      { title: 'Shot list', description: 'Angles, crops and formats agreed up front.' },
      { title: 'Studio day', description: 'Tethered shooting in our Bucharest studio, with live approval.' },
      { title: 'Retouching', description: 'Dust, reflections and colour corrected.' },
    ],
    startingPrice: 300,
    packages: [
      { name: 'Starter', price: 300, hours: 2, includes: ['Up to 10 products', '3 angles each', 'White background'] },
      { name: 'Catalogue', price: 750, hours: 6, popular: true, includes: ['Up to 40 products', '3 angles each', 'White background', '10 lifestyle shots'] },
      { name: 'Campaign', price: 1600, hours: 8, includes: ['Styled lifestyle sets', 'Model on request', 'Ad-ready crops'] },
    ],
    faqs: [],
    keywords: ['product photography Bucharest', 'fotografie produs București', 'e-commerce photography Bucharest', 'packshot studio Bucharest'],
  },
] as const

export const locations = [
  {
    key: 'bucharest',
    slug: 'bucharest',
    name: 'Bucharest',
    region: 'Bucharest',
    isPrimary: true,
    travelFee: 0,
    geo: { lat: 44.4268, lng: 26.1025 },
    intro: `Bucharest is home. Our studio is in Sector 1 and most of our weekends are spent somewhere between Piața Victoriei and the lakes in the north of the city — so we know which streets in the Old Town are empty at 8am, where Herăstrău is quiet on a Saturday and how long it really takes to cross the city between the church and the restaurant.

The capital gives you every backdrop in one day: Belle Époque palaces on Calea Victoriei, the neoclassical columns of the Athenaeum, leafy villas in Cotroceni and Dorobanți, and modern glass in Floreasca. In spring the linden trees and magnolias make the parks glow; in autumn Cișmigiu turns gold by mid-October.

We cover weddings, engagement sessions, corporate events and brand shoots everywhere in Bucharest, and there is never a travel fee in any sector.`,
    venues: [
      { name: 'King Michael I Park (Herăstrău)', description: 'Lake, rose garden and the Japanese garden — the classic choice for wedding portraits in the north of the city.' },
      { name: 'Romanian Athenaeum', description: 'Iconic neoclassical concert hall with a small park in front — elegant city portraits.' },
      { name: 'Old Town & Macca-Villacrosse Passage', description: 'Cobbled streets, the glass-roofed passage and the Stavropoleos Monastery courtyard for urban portraits.' },
      { name: 'Cișmigiu Gardens', description: 'The oldest park in Bucharest — lake, bridges and old trees, at its best in autumn.' },
      { name: 'Dimitrie Brândză Botanical Garden', description: 'Greenhouses and quiet alleys in Cotroceni; a photo permit is required.' },
    ],
    nearbyAreas: ['Sector 1', 'Dorobanți', 'Floreasca', 'Cotroceni', 'Băneasa', 'Herăstrău'],
    faqs: [
      { question: 'Is there a travel fee within Bucharest?', answer: 'No — every sector of Bucharest is included, and so is the whole of Ilfov County.' },
      { question: 'Where can we do a quick portrait session between the church and the restaurant?', answer: 'It depends on your route: Cișmigiu and the Athenaeum work well in the centre, Herăstrău and Casa Doina in the north. We plan a 20–30 minute stop that avoids rush-hour traffic.' },
    ],
  },
  {
    key: 'ilfov',
    slug: 'ilfov-county',
    name: 'Ilfov County',
    region: 'Ilfov County',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.5355, lng: 26.0857 },
    intro: `Ilfov wraps around Bucharest like a green ring, and it is where most couples in the capital actually celebrate. Within 20–40 minutes of the city you will find princely palaces, monasteries on lakes, forest-edge gardens and huge modern ballrooms that would never fit inside the city.

Because the county is so close, a wedding in Ilfov is usually a mix: getting ready in a Bucharest apartment, a church in the city or a monastery outside it, then the party in a garden venue in Buftea, Snagov, Corbeanca or Otopeni. We plan the timeline around the A3, DN1 and the ring road so nobody waits in traffic.

The light out here is also different — open fields and lakes give long, soft sunsets in summer, perfect for golden-hour portraits. Travel anywhere in Ilfov County is always included.`,
    venues: [
      { name: 'Știrbey Palace, Buftea', description: '19th-century palace with a park on Lake Buftea — a romantic setting for ceremonies and portraits.' },
      { name: 'Cernica Monastery', description: 'Monastery on two islands in Lake Cernica, east of Bucharest — peaceful and very photogenic.' },
      { name: 'Căldărușani Monastery', description: 'Historic monastery on the lake shore near Gruiu, ideal for a religious ceremony away from the city.' },
      { name: 'Therme București, Balotești', description: 'Tropical glasshouse and palm gardens — unusual for brand shoots and creative sessions (with permission).' },
    ],
    nearbyAreas: ['Buftea', 'Chitila', 'Pantelimon', 'Popești-Leordeni', 'Bragadiru', 'Măgurele'],
    faqs: [
      { question: 'Do you charge travel fees anywhere in Ilfov?', answer: 'No. Every locality in Ilfov County is covered at no extra cost. A small fee applies only to venues more than about 40 km from Bucharest.' },
      { question: 'How do you handle the drive from Bucharest to the venue?', answer: 'We check the route and the traffic for your date and time, build buffers into the timeline, and if needed one of us goes ahead to the venue to photograph details before you arrive.' },
    ],
  },
  {
    key: 'snagov',
    slug: 'snagov',
    name: 'Snagov',
    region: 'Ilfov County',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.7006, lng: 26.1853 },
    intro: `Snagov is the lakeside escape of Bucharest — 40 minutes north on DN1 and you are among forests, private jetties and garden venues on the water. It is one of the most requested places for summer weddings near the capital, and for good reason.

The long, narrow lake gives beautiful reflections in the evening, and many venues are set up for boat entrances, ceremonies on the pontoon and parties under the trees. Sunset on the western shore is spectacular from June to August; in September the mornings bring mist over the water that we love for portraits.

We know the jetties, the access roads that get busy on Friday afternoons and the spots that look best by drone. No travel fee applies.`,
    venues: [
      { name: 'Lake Snagov', description: 'Reed-lined water, jetties and boat trips — reflections at sunset and morning mist in early autumn.' },
      { name: 'Snagov Monastery', description: 'Medieval monastery on the island in the middle of the lake, reached by boat or footbridge.' },
      { name: 'Snagov Palace', description: 'Neo-Romanian palace with a park sloping down to the lake.' },
      { name: 'Snagov Forest reserve', description: 'Old oak and ash forest along the shore — soft green light for summer portraits.' },
    ],
    nearbyAreas: ['Ciolpani', 'Gruiu', 'Periș', 'Tâncăbești', 'Ghermănești'],
    faqs: [
      { question: 'Can we film our wedding on Lake Snagov with a drone?', answer: 'In most of the Snagov area, yes, with the right permits — we request them in advance and check the rules at your venue.' },
      { question: 'When is the best time for portraits in Snagov?', answer: 'The hour before sunset from June to August, or early morning in September when there is mist on the lake.' },
    ],
  },
  {
    key: 'corbeanca',
    slug: 'corbeanca',
    name: 'Corbeanca',
    region: 'Ilfov County',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.6044, lng: 26.0436 },
    intro: `Corbeanca is the quiet, green side of northern Ilfov — about 30 minutes from Bucharest, between the forest and the fields. Many couples choose it for intimate garden weddings, private-villa celebrations and relaxed outdoor parties far from the noise of the city.

What we love here is the space: open fields that glow at sunset, tree-lined lanes in the villages of Tamași and Ostratu, and the edge of Corbeanca Forest just a few minutes away. It is ideal for natural, unposed portraits and for engagement sessions with a countryside feel.

On busy Saturdays the road through Otopeni and Balotești fills up, so we plan the drive carefully. As everywhere in Ilfov, no travel fee applies.`,
    venues: [
      { name: 'Corbeanca Forest', description: 'Oak forest edge with soft, filtered light — beautiful for summer and autumn portraits.' },
      { name: 'Garden venues in Corbeanca', description: 'Private gardens and villas for intimate ceremonies and outdoor parties.' },
      { name: 'Tamași and Ostratu village lanes', description: 'Country roads, fields and sunsets for relaxed engagement sessions.' },
    ],
    nearbyAreas: ['Tamași', 'Ostratu', 'Petrești', 'Balotești', 'Săftica'],
    faqs: [
      { question: 'Do you photograph small weddings in Corbeanca?', answer: 'Yes — intimate garden weddings with 30–80 guests are some of our favourites. The Essential package is often enough.' },
      { question: 'Can we do an engagement session in Corbeanca?', answer: 'Absolutely. The fields and forest edge are lovely in the last hour before sunset, and we can combine them with a stop at Lake Snagov.' },
    ],
  },
  {
    key: 'mogosoaia',
    slug: 'mogosoaia',
    name: 'Mogoșoaia',
    region: 'Ilfov County',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.5292, lng: 25.9997 },
    intro: `Mogoșoaia is home to one of the most photographed buildings near Bucharest: the Brâncoveanu palace, built in 1702, with its loggias, carved stone and gardens running down to the lake. Just 15–20 minutes from the north-west of the city, it is a favourite for ceremonies, wedding portraits and engagement sessions.

The palace looks completely different with each season — wisteria and fresh green in May, warm stone and long shadows in summer, golden trees reflected in the lake in October. The gardens can be busy on weekend afternoons, so we time portraits for quieter moments and know the corners where you can still have the place to yourselves.

Photography inside the complex may require an access fee, which we arrange in advance. No travel fee applies.`,
    venues: [
      { name: 'Mogoșoaia Palace', description: 'Brâncoveanu-style palace with an arched loggia and a courtyard — one of the most elegant backdrops around Bucharest.' },
      { name: 'Mogoșoaia gardens & lake', description: 'Formal gardens, a lakeside path and old trees for natural portraits.' },
      { name: 'Saint George Church', description: 'Brâncoveanu church from 1688 inside the palace grounds.' },
      { name: 'Elchingen Villa', description: 'Romantic villa in the palace park, a quieter corner for portraits.' },
    ],
    nearbyAreas: ['Chitila', 'Buftea', 'Bucureștii Noi', 'Străulești', 'Otopeni'],
    faqs: [
      { question: 'Do we need a permit to shoot at Mogoșoaia Palace?', answer: 'For wedding photography and filming, the complex usually charges an access fee. We check the current rules and arrange it before your date.' },
      { question: 'When is Mogoșoaia least crowded?', answer: 'Weekday mornings and the last hour before closing. On Saturdays we plan a short, efficient portrait session around the busiest times.' },
    ],
  },
  {
    key: 'voluntari',
    slug: 'voluntari-pipera',
    name: 'Voluntari & Pipera',
    region: 'Ilfov County',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.4925, lng: 26.1764 },
    intro: `Voluntari and Pipera sit right on the north-east edge of Bucharest and are where much of the city's business life happens. Pipera's office towers house tech companies, banks and multinationals — so this is where we film most company presentation videos, recruitment campaigns and team headshot days.

The glass façades and open plazas give a clean, modern look that works brilliantly for brand content, especially in the soft light of early morning before the area fills up. For couples living in the new residential neighbourhoods here, we also cover getting-ready photos and civil ceremonies at the Voluntari town hall.

Traffic on Pipera's main roads is heavy at rush hour, so we schedule office shoots between 10:00 and 16:00. No travel fee applies.`,
    venues: [
      { name: 'Pipera office district', description: 'Glass towers and plazas — modern backdrop for corporate video and team portraits.' },
      { name: 'Băneasa Forest', description: 'Large forest just west of Pipera, for outdoor brand shoots and relaxed portraits.' },
      { name: 'Romexpo', description: 'Bucharest’s main exhibition centre, a short drive away, for trade fairs and conferences.' },
    ],
    nearbyAreas: ['Pipera', 'Ștefăneștii de Jos', 'Afumați', 'Dobroești', 'Tunari'],
    faqs: [
      { question: 'Can you film a company video in our Pipera office?', answer: 'Yes. We bring a lean crew with lighting and audio, work around your team’s schedule and can deliver matching photos from the same day.' },
      { question: 'Do you organise headshot days for companies in Voluntari?', answer: 'Yes — we set up a portable studio in a meeting room and photograph up to 40 people per hour.' },
    ],
  },
  {
    key: 'otopeni',
    slug: 'otopeni',
    name: 'Otopeni',
    region: 'Ilfov County',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.55, lng: 26.07 },
    intro: `Otopeni is best known for Henri Coandă International Airport, but for us it is the gateway to northern Ilfov — and a practical base for weddings with guests flying in from abroad. Many diaspora couples choose a venue near Otopeni so relatives can land in the morning and dance the same evening.

The hotels and conference centres around the airport also host corporate events, product launches and company parties, and we photograph and film them regularly. Therme București in nearby Balotești is ten minutes away for unusual, colourful brand sessions.

Drone flights are not possible near the airport, so here we focus on ground-level cinematic footage. Travel is always included.`,
    venues: [
      { name: 'Henri Coandă International Airport', description: 'Arrival moments for guests and couples coming home for their wedding.' },
      { name: 'Conference hotels near the airport', description: 'Ballrooms and event halls for corporate events and large weddings.' },
      { name: 'Therme București, Balotești', description: 'Glasshouse gardens ten minutes away, for creative brand content (with permission).' },
    ],
    nearbyAreas: ['Tunari', 'Balotești', 'Corbeanca', 'Băneasa'],
    faqs: [
      { question: 'Many of our guests fly in — is Otopeni a good choice?', answer: 'Very. Venues near the airport make logistics easy, and we can photograph family arrivals as part of your wedding story.' },
      { question: 'Can you use a drone in Otopeni?', answer: 'No — the area around the airport is restricted airspace. We plan cinematic ground shots instead, or add aerials at a second location further from the airport.' },
    ],
  },
] as const

export const testimonials = [
  { key: 't1', name: 'Ana & Mihai', role: 'Wedding at Mogoșoaia Palace', service: 'wedding-photo', rating: 5, featured: true, quote: 'We have looked at our gallery every day since. They caught moments we did not even know happened — my dad crying during the first dance still gets me.' },
  { key: 't2', name: 'Elena & Radu', role: 'Wedding film, Snagov', service: 'wedding-film', rating: 5, featured: true, quote: 'The film is unreal. Hearing our vows again over those sunset shots of the lake… our whole family has watched it a dozen times.' },
  { key: 't3', name: 'Cristina Popescu', role: 'Marketing Lead, fintech start-up in Pipera', service: 'brand-video', rating: 5, featured: true, quote: 'Brief on Monday, rough cut the next week, launch video live in two weeks. Our recruitment ads have never performed better.' },
  { key: 't4', name: 'Bogdan Ilie', role: 'Event Manager, TechSummit Bucharest', service: 'event-photo', rating: 5, featured: false, quote: 'Same-day selects meant our social team posted while people were still in the room at Romexpo. Professional and invisible.' },
  { key: 't5', name: 'Ioana & Alex', role: 'Wedding in Bucharest Old Town', service: 'wedding-photo', rating: 5, featured: false, quote: 'Calm, funny and so organised. The timeline they built saved our day when it started raining in the Old Town.' },
  { key: 't6', name: 'Maria Stanciu', role: 'Founder, ceramics brand in Bucharest', service: 'product-photo', rating: 5, featured: false, quote: 'Our conversion rate went up after we swapped in the new product photos. Colours are spot on.' },
  { key: 't7', name: 'Diana & Paul', role: 'Wedding at Știrbey Palace, Buftea', service: 'wedding-film', rating: 4, featured: false, quote: 'Beautiful film and great communication. Would have loved it a bit sooner, but worth the wait.' },
] as const

export const projects = [
  {
    key: 'p1', slug: 'mogosoaia-palace-wedding-ana-mihai', title: 'Ana & Mihai — Golden hour at Mogoșoaia Palace', service: 'wedding-photo', location: 'mogosoaia', venue: 'Mogoșoaia Palace, Ilfov', clientType: 'Couple', date: '2026-06-14', featured: true, testimonial: 't1',
    excerpt: 'A relaxed summer wedding at Mogoșoaia Palace, with a ceremony in the garden at sunset and a party under string lights by the lake.',
    brief: 'Ana and Mihai wanted documentary photos that felt like their friends had taken them — but better. No stiff group shots, lots of candid moments, and a few portraits under the palace loggia at golden hour.',
    approach: `## Planning around the light
We moved the ceremony 40 minutes later so the couple walked out of the garden straight into golden hour. A scouting visit two weeks before told us exactly when the sun would fall through the arches of the loggia.

## Two photographers, two stories
- One of us photographed the bride getting ready in Dorobanți, the other the groom in Bucureștii Noi
- During cocktail hour one stayed with the guests, the other took the couple for a 15-minute walk along the lake
- We reunited for speeches and the first dance`,
    result: 'Ana and Mihai received 780 edited photos and a 72-hour sneak peek that they used for their thank-you cards. Their gallery was viewed over 3,000 times by family and friends.',
    deliverables: ['780 edited photos', '72h sneak peek', '30×30 album'], tags: ['palace', 'summer', 'golden hour', 'Mogoșoaia'],
  },
  {
    key: 'p2', slug: 'snagov-lake-wedding-film-elena-radu', title: 'Elena & Radu — A lakeside wedding film at Snagov', service: 'wedding-film', location: 'snagov', venue: 'Lake Snagov, Ilfov', clientType: 'Couple', date: '2026-09-05', featured: true, testimonial: 't2',
    excerpt: 'A cinematic wedding film with drone shots over Lake Snagov, a ceremony on the pontoon and vows recorded in crystal-clear audio.',
    brief: 'Elena and Radu wanted a film that felt like a movie trailer — wide shots of the lake and the forest — but also the intimate audio of their handwritten vows.',
    approach: `## Sound first
We put wireless lavalier mics on both of them and the officiant, and recorded the speeches straight from the DJ desk.

## Drone and gimbal
With permits arranged in advance, our licensed drone pilot filmed the lake at sunset, and we used gimbals for the long walking shots through Snagov forest.`,
    result: 'A 5-minute highlight film, a 22-minute documentary edit and a vertical teaser that reached 40,000 views on Instagram.',
    deliverables: ['5 min highlight film', '22 min documentary edit', '60s vertical teaser'], tags: ['lake', 'drone', 'film', 'Snagov'],
  },
  {
    key: 'p3', slug: 'pipera-fintech-company-video', title: 'Fintech launch film — 90 seconds that hired 20 engineers', service: 'brand-video', location: 'voluntari', venue: 'Office & rooftop, Pipera', clientType: 'Tech start-up', date: '2026-04-20', featured: true, testimonial: 't3',
    excerpt: 'A recruitment and company presentation film for a Bucharest fintech start-up in Pipera, with matching stills and social cut-downs.',
    brief: 'The team needed a recruitment film that showed the real people behind the product — no stock footage, no corporate clichés — ready for a launch in three weeks.',
    approach: `## Interviews as the backbone
We interviewed five engineers on camera, then built the film around their own words.

## One day, two outputs
While the video crew filmed, our photographer shot new team portraits and office lifestyle photos for the careers page — including the rooftop with a view over northern Bucharest.`,
    result: 'The hero film plus five 9:16 cut-downs ran as LinkedIn and Instagram ads. The company filled 20 engineering roles in the following quarter.',
    deliverables: ['90s hero film', '5 vertical cut-downs', '60 team photos'], tags: ['recruitment', 'startup', 'linkedin', 'Pipera'],
  },
  {
    key: 'p4', slug: 'romexpo-conference-photography', title: 'TechSummit 2026 at Romexpo — 1,200 attendees, same-day delivery', service: 'event-photo', location: 'bucharest', venue: 'Romexpo, Bucharest', clientType: 'Conference', date: '2026-05-12', featured: false, testimonial: 't4',
    excerpt: 'Two-day conference coverage at Romexpo with live selects for the social team and a headshot studio for speakers.',
    brief: 'The organisers needed real-time photos for social media, high-quality speaker portraits, and a full gallery for sponsors within three days.',
    approach: `## A live pipeline
Our second shooter edited on site; selects were in the client's shared folder within 30 minutes of each keynote.

## Speaker studio
A pop-up studio backstage gave every speaker a consistent portrait for the post-event recap.`,
    result: '1,100 edited photos, 45 speaker portraits and more than 200 images posted during the event itself.',
    deliverables: ['1,100 edited photos', '45 speaker portraits', 'Live selects'], tags: ['conference', 'live', 'Romexpo'],
  },
  {
    key: 'p5', slug: 'rainy-wedding-bucharest-old-town', title: 'Ioana & Alex — A rainy-day wedding in Bucharest Old Town', service: 'wedding-photo', location: 'bucharest', venue: 'Old Town, Bucharest', clientType: 'Couple', date: '2025-10-11', featured: true, testimonial: 't5',
    excerpt: 'When the forecast said 100% rain we leaned in: umbrellas, reflections and moody portraits in the passages of the Old Town.',
    brief: 'An intimate wedding of 60 guests in a restaurant in the Old Town. The couple were worried about the forecast and wanted a backup plan that still felt special.',
    approach: `## Plan B was the best plan
We scouted the covered Macca-Villacrosse Passage and the courtyard of Stavropoleos the day before, packed clear umbrellas and used the wet cobblestones for reflections.`,
    result: 'Some of our favourite portraits ever. The couple say the rain is now their favourite part of the story.',
    deliverables: ['520 edited photos', 'Sneak peek in 48h'], tags: ['rain', 'intimate', 'Old Town'],
  },
  {
    key: 'p6', slug: 'ceramics-product-photography-bucharest', title: 'Handmade ceramics — catalogue and lifestyle shoot', service: 'product-photo', location: 'bucharest', venue: 'NeonLens studio, Bucharest', clientType: 'E-commerce brand', date: '2026-02-08', featured: false, testimonial: 't6',
    excerpt: '40 products on white plus styled lifestyle scenes for an independent Bucharest ceramics brand.',
    brief: 'A growing ceramics brand from Bucharest needed consistent packshots for its new online shop and eMAG listing, plus lifestyle images for Instagram.',
    approach: `## Tethered and colour-calibrated
Every glaze was checked against the physical piece on a calibrated monitor before we moved on.`,
    result: 'The shop relaunched with the new images and conversion rate improved noticeably in the first month.',
    deliverables: ['120 packshots', '15 lifestyle images'], tags: ['ecommerce', 'ceramics'],
  },
  {
    key: 'p7', slug: 'stirbey-palace-wedding-film-buftea', title: 'Diana & Paul — A wedding film at Știrbey Palace, Buftea', service: 'wedding-film', location: 'ilfov', venue: 'Știrbey Palace, Buftea', clientType: 'Couple', date: '2025-08-23', featured: false, testimonial: 't7',
    excerpt: 'A warm summer film at Știrbey Palace on Lake Buftea, with a garden ceremony and a fireworks finale.',
    brief: 'Diana and Paul wanted a joyful, fast-paced film that captured the party energy of their 200-guest wedding.',
    approach: `## Energy in the edit
We shot high-frame-rate footage on the dance floor and cut the film to the band's own live recording.`,
    result: 'A 6-minute highlight film and full speeches edit, shared by the couple with family in four countries.',
    deliverables: ['6 min highlight film', 'Speeches edit'], tags: ['palace', 'party', 'summer', 'Buftea'],
  },
  {
    key: 'p8', slug: 'corbeanca-guesthouse-reels', title: 'Boutique guesthouse — rooms, food and Reels in one day', service: 'brand-video', location: 'corbeanca', venue: 'Corbeanca, Ilfov', clientType: 'Hospitality', date: '2026-03-15', featured: false, testimonial: null,
    excerpt: 'Photo and short-form video content for a boutique guesthouse relaunch in Corbeanca, 30 minutes from Bucharest.',
    brief: 'A 12-room guesthouse popular with Bucharest families at weekends was relaunching after renovation and needed photos for booking platforms plus a month of Reels.',
    approach: `## Shot list by platform
We planned every shot by destination — Booking.com, website hero, Instagram grid, Reels — so nothing was wasted.`,
    result: 'Direct bookings increased and the Reels series became the guesthouse’s best-performing content to date.',
    deliverables: ['80 photos', '12 Reels', 'Website hero video'], tags: ['hospitality', 'reels', 'Corbeanca'],
  },
] as const

export const posts = [
  {
    key: 'b1',
    slug: 'wedding-photographer-cost-bucharest',
    title: 'How much does a wedding photographer cost in Bucharest? (2026 prices)',
    category: 'pricing',
    publishedAt: '2026-09-02',
    services: ['wedding-photo'],
    location: 'bucharest',
    excerpt: 'Real 2026 price ranges for wedding photography in Bucharest and Ilfov, what drives the cost, and how to compare quotes fairly.',
    content: `Wedding photography prices in Bucharest vary a lot — from €500 to more than €3,500 — and it is not always obvious why. Here is an honest breakdown from a Bucharest studio that quotes dozens of weddings every month.

## Typical price ranges in Bucharest in 2026
- **€500–€900:** one photographer, 4–6 hours, often newer to weddings
- **€1,000–€2,000:** experienced photographer or team of two, full day, online gallery
- **€2,000–€3,500+:** established studios, two photographers, albums, engagement sessions

## What actually drives the price
Hours of coverage and number of photographers are the biggest factors. In Bucharest, the day is often long: preparations in two different sectors, a church in the city, then a venue in Ilfov. After that comes editing time — a full wedding is typically 40–60 hours of work after the day itself — plus albums and the season.

## Travel fees in Bucharest and Ilfov
Ask whether travel is included. Many photographers charge extra for venues in Snagov, Corbeanca or Mogoșoaia. We cover all of Bucharest and Ilfov at no travel fee.

## How to compare quotes fairly
Ask every photographer for a **full wedding gallery**, not just highlights. Check how many edited photos you get, when you get them, and whether backup equipment and a contract are included.

## Our prices
Our wedding packages start at €1,200. You can build your own estimate in under a minute with our quote calculator.`,
    faqs: [
      { question: 'Is a second photographer worth it for a wedding in Bucharest?', answer: 'For weddings over 80 guests or with preparations in different parts of the city, yes — you get both sides of every moment and many more candid guest photos.' },
    ],
  },
  {
    key: 'b2',
    slug: 'wedding-videographer-cost-bucharest',
    title: 'How much does a wedding videographer cost in Bucharest and Ilfov?',
    category: 'pricing',
    publishedAt: '2026-08-18',
    services: ['wedding-film'],
    location: null,
    excerpt: 'Wedding film prices in Bucharest and Ilfov in 2026, what is included at each level, and the questions to ask before you book.',
    content: `A wedding film is the only way to hear your vows again. But in Bucharest prices range from €600 to €5,000. Here is what you get at each level.

## Price ranges
- **€600–€1,200:** one filmmaker, highlight film only
- **€1,500–€2,500:** two filmmakers, highlight film plus ceremony and speeches
- **€3,000+:** documentary-length film, drone, multiple edits

## Audio is everything
Ask how vows and speeches are recorded. Without wireless mics on the couple and officiant, the most emotional moments are often lost — especially in big ballrooms around Bucharest.

## Drone: city vs. Ilfov
Central Bucharest and the area around Otopeni airport are restricted airspace. If aerial shots matter to you, a venue in Snagov, Corbeanca or Mogoșoaia gives far more freedom. Ask your videographer who handles the permits.

## Music licensing
Films with unlicensed music get muted on Instagram and YouTube. Make sure your videographer uses a licensed library.`,
    faqs: [],
  },
  {
    key: 'b3',
    slug: 'wedding-venues-photo-spots-ilfov',
    title: 'The best wedding venues and photo spots in Ilfov and Bucharest',
    category: 'venues',
    publishedAt: '2026-07-10',
    services: ['wedding-photo'],
    location: 'ilfov',
    excerpt: 'Our favourite wedding settings around Bucharest — palaces, lakes and forests in Ilfov, plus the best city spots for portraits and engagement photos.',
    content: `After hundreds of weddings in and around Bucharest, these are the places we keep coming back to.

## Palaces and monasteries in Ilfov
- **Mogoșoaia Palace** — Brâncoveanu architecture, gardens and a lake; an access fee applies for photography
- **Știrbey Palace, Buftea** — a romantic park on Lake Buftea
- **Cernica Monastery** — monastery islands on a lake east of the city
- **Căldărușani Monastery** — a quiet lakeside setting for a church ceremony

## Lakes and forests
- **Lake Snagov** — jetties, boat entrances and sunsets over the water
- **Corbeanca** — garden venues and the edge of the forest for intimate weddings

## Photo spots in Bucharest
- **King Michael I Park (Herăstrău)** — best early morning, before the crowds
- **Romanian Athenaeum** — elegant and central
- **Cișmigiu Gardens** — bridges and old trees, gorgeous in autumn
- **Old Town** — the Macca-Villacrosse Passage is a lifesaver on rainy days

## Tips
Always check permit rules, plan for golden hour, allow for Saturday traffic between Bucharest and Ilfov, and have a rain plan. We help every couple choose locations that fit their timeline.`,
    faqs: [
      { question: 'Do we need a permit to take wedding photos at Mogoșoaia Palace?', answer: 'Usually an access fee applies for professional photography and filming. We check the current rules and arrange it in advance for our couples.' },
    ],
  },
  {
    key: 'b4',
    slug: 'how-to-brief-company-video-bucharest',
    title: 'How to brief a company video in Bucharest (and get what you actually need)',
    category: 'guides',
    publishedAt: '2026-06-01',
    services: ['brand-video'],
    location: null,
    excerpt: 'A simple one-page brief template for Bucharest marketing teams commissioning a company or brand video for the first time.',
    content: `The difference between a video that performs and one that sits unused is usually the brief, not the camera.

## The one-page brief
- **Goal:** what should viewers do after watching?
- **Audience:** who exactly is watching, and where?
- **Message:** one sentence the viewer must remember
- **Formats:** 16:9, 9:16, 1:1 — and lengths for each
- **Deadline and budget**

## Locations and logistics in Bucharest
Filming in an office building in Pipera or the centre often needs approval from building management, and filming in public spaces may need a permit from the city. Add these to the brief early — they can take a week or two.

## Plan the cut-downs first
Most views happen on phones. Decide your vertical edits before the shoot so we can frame for them.`,
    faqs: [],
  },
  {
    key: 'b5',
    slug: 'product-photography-checklist-bucharest',
    title: 'Product photography checklist for Bucharest e-commerce shops',
    category: 'guides',
    publishedAt: '2026-05-12',
    services: ['product-photo'],
    location: null,
    excerpt: 'Everything to prepare before a product shoot in Bucharest so your images pass marketplace rules and convert.',
    content: `Good product photos are planned before anyone picks up a camera.

## Before the shoot
- Clean, label-free samples of every variant
- A list of angles and crops each platform needs
- Brand colour references for accurate reproduction
- A delivery plan: drop products off at the studio or send them by courier within Bucharest

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
    { name: 'Drone footage (Ilfov venues, permits included)', price: 250, unit: 'flat', services: ['wedding-film', 'brand-video'] },
    { name: 'Engagement session in Bucharest', price: 250, unit: 'flat', services: ['wedding-photo'] },
    { name: 'Fine-art album 30×30', price: 450, unit: 'flat', services: ['wedding-photo'] },
    { name: 'Vertical teaser (9:16)', price: 150, unit: 'flat', services: ['wedding-film'] },
    { name: 'Same-day selects', price: 150, unit: 'flat', services: ['event-photo'] },
    { name: 'Extra social cut-downs (×5)', price: 300, unit: 'flat', services: ['brand-video'] },
    { name: 'Lifestyle styling & props', price: 200, unit: 'flat', services: ['product-photo'] },
  ],
} as const
