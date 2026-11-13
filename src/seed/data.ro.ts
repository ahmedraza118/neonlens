/**
 * Conținut demo în română (localizarea "ro", limba principală a site-ului) pentru Lumenza —
 * București și Ilfov. Oglindește ./data.ts 1:1 — aceleași exporturi, aceleași chei, aceleași lungimi și
 * aceeași ordine a listelor — astfel încât valorile se citesc pe aceleași căi din ambele fișiere.
 * Înlocuiți-l cu datele reale ale firmei, proiecte reale și recenzii reale înainte de lansare —
 * nu publicați niciodată testimoniale inventate pe un site live.
 */

export const settings = {
  businessName: 'Lumenza',
  tagline: 'Fotograf și videograf de nuntă și brand în București',
  description:
    'Lumenza este un studio foto-video din București: fotografie de nuntă cinematică, filme de nuntă, foto și video de botez, evenimente și conținut pentru branduri în București, județul Ilfov și în jurul lacurilor și palatelor din apropierea Capitalei. Lucrăm în română și engleză.',
  email: 'hello@neonlens.studio',
  phone: '+40 712 345 678',
  whatsapp: '40712345678',
  address: { street: 'Strada Paris 45, Sector 1', city: 'București', region: 'București', postalCode: '011814', country: 'RO' },
  geo: { lat: 44.4396, lng: 26.0963 },
  priceRange: '€€',
  currency: 'EUR',
  foundingYear: 2017,
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const, opens: '10:00', closes: '18:00' },
  ],
  stats: [
    { value: '320+', label: 'Nunți în București și Ilfov' },
    { value: '9 ani', label: 'În spatele camerei' },
    { value: '4.9★', label: 'Rating mediu' },
    { value: '72h', label: 'Preview livrat în' },
  ],
  about: {
    heading: 'Doi povestitori din București și o geantă foto mult prea grea.',
    body: `Lumenza a pornit în 2017, când un fotograf documentarist și un regizor de videoclipuri muzicale, amândoi născuți și crescuți în București, au decis că nunțile merită aceeași grijă ca un platou de filmare.

Astăzi suntem o echipă mică, de patru oameni, cu studioul în Sectorul 1, la câteva minute de Piața Victoriei. Cunoaștem orașul pe de rost — cât durează drumul pe Kiseleff sâmbătă după-amiaza, când e lumina cea mai blândă în Herăstrău, pe ce mal al lacului Snagov apune soarele. Pregătim fiecare ședință ca pe o producție — listă de cadre, studiu de lumină, echipament de rezervă — iar în ziua cea mare ne dăm la o parte și lăsăm momentele reale să se întâmple.

Lucrăm cu cupluri care se căsătoresc în București și Ilfov și își doresc imagini sincere și cinematice, și cu branduri bucureștene care au nevoie de conținut care chiar oprește scroll-ul. Toată echipa lucrează în română și engleză, așa că ne înțelegem la fel de ușor cu bunicii, cu invitații veniți din străinătate și cu echipele multinaționalelor din Pipera.`,
    founderName: 'Andrei & Ioana',
    founderRole: 'Fondatori',
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
    { question: 'Cu cât timp înainte ar trebui să vă rezervăm?', answer: 'Sâmbetele din sezonul de nunți (mai–septembrie) în București și Ilfov se rezervă cu 12–18 luni înainte. Ședințele de brand și evenimentele corporate au nevoie de obicei de 2–4 săptămâni. Verificați data prin formularul de contact — vă răspundem în maximum 24 de ore, în română sau în engleză, cum vă e mai comod.' },
    { question: 'Cât este avansul și cum îl pot plăti?', answer: 'Un avans de 30% vă rezervă data. Îl puteți plăti online cu cardul, Apple Pay sau Google Pay la rezervare; restul se achită cu 14 zile înainte de ședință.' },
    { question: 'Percepeți taxă de deplasare în București și Ilfov?', answer: 'Nu. Acoperim tot Bucureștiul și tot județul Ilfov — Snagov, Corbeanca, Mogoșoaia, Otopeni, Voluntari, Pipera și tot ce e între ele — fără taxă de deplasare. Pentru locațiile aflate la peste 40 km de oraș se aplică o taxă mică, afișată în calculatorul de ofertă.' },
    { question: 'Când primim fotografiile și filmul?', answer: 'Primiți un preview în 72 de ore, galeria foto completă în 4–6 săptămâni și filmul editat în 8–10 săptămâni.' },
    { question: 'Putem alege ce fotografii se editează?', answer: 'Da. Primiți o galerie online privată în care vă marcați preferatele și lăsați notițe; folosim selecția voastră pentru album și pentru retușurile suplimentare.' },
    { question: 'Ce se întâmplă dacă rămânem blocați în traficul din București?', answer: 'Includem rezerve de timp pentru trafic în fiecare program, plecăm din timp spre locațiile din Ilfov și ajungem mereu înaintea voastră. În plus, fiecare cameră înregistrează pe două carduri și avem mereu body-uri și obiective de rezervă — nu lăsăm nimic la voia întâmplării.' },
  ],
}

export const homepage = {
  heroEyebrow: 'Foto & film · București și Ilfov',
  heroHeading: 'Fotograf și videograf de nuntă în București și Ilfov',
  heroSubheading:
    'Suntem Lumenza — o echipă foto-video din București care creează imagini sincere și cinematice pentru cupluri și branduri din Capitală, din județul Ilfov și de pe malurile lacului Snagov.',
  process: [
    { title: 'Scrieți-ne', description: 'Trimiteți-ne un mesaj rapid sau pe WhatsApp. Vă confirmăm disponibilitatea și vă trimitem o ofertă personalizată în 24 de ore.' },
    { title: 'Planificăm împreună', description: 'Un apel sau o cafea în București ca să vă cunoaștem povestea, apoi lista de cadre, programul zilei și vizita locațiilor din oraș sau din Ilfov.' },
    { title: 'Ziua ședinței', description: 'O echipă calmă și experimentată, care se integrează discret — cu timp de rezervă pentru trafic și echipament de rezervă pentru orice.' },
    { title: 'Galeria voastră', description: 'Preview în 72 de ore. Galerie privată completă, din care alegeți, descărcați și distribuiți.' },
  ],
}

export const services = [
  {
    key: 'wedding-photo',
    slug: 'fotograf-nunta',
    title: 'Fotograf de nuntă',
    seo: {
      title: 'Fotograf nuntă București și Ilfov | Lumenza',
      description: 'Fotograf de nuntă în București și Ilfov, stil documentar. Doi fotografi, preview în 72h și galerie privată. Pachete de la 1.200 €. Verificați data!',
    },
    category: 'photo',
    order: 1,
    tagline: 'Fotografii de nuntă sincere și cinematice în București și Ilfov',
    excerpt: 'Fotograf de nuntă în București și Ilfov, în stil documentar: surprindem ziua exact așa cum ați trăit-o — de la pregătiri până la ultimul dans.',
    intro: `Ziua nunții trece într-o clipă. Treaba noastră este să o încetinim: râsul emoționat dinaintea cununiei civile, chipul bunicii în biserică, nebunia de pe ringul de dans la 2 noaptea, într-un salon din Ilfov.

Fotografiem nunți în București și împrejurimi în stil documentar, cu un ochi editorial. Pozare minimă, multe momente reale și câteva portrete frumos luminate — în Centrul Vechi, în Parcul Herăstrău sau pe malul lacului Snagov — atunci când lumina este perfectă.

Fiecare nuntă include un apel de planificare, un program construit în jurul celei mai bune lumini și al traficului real din București, două carduri în fiecare cameră și o galerie online privată pe care o puteți împărți cu invitații.`,
    highlights: [
      { title: 'Doi fotografi', description: 'Ambele perspective ale fiecărui moment — pregătiri în două colțuri ale orașului, unghiuri diferite la biserică și la cununia civilă, reacțiile spontane ale invitaților.' },
      { title: 'Preview în 72 de ore', description: '30–50 de fotografii editate, ca să le împărtășiți cât amintirile sunt proaspete.' },
      { title: 'Galerie online privată', description: 'Alegeți preferatele, descărcați și distribuiți cu familia. Include magazin de printuri.' },
      { title: 'Program gândit după lumină', description: 'Planificăm portretele în jurul orei de aur — și în jurul traficului de sâmbătă dintre București și locația voastră.' },
      { title: 'Backup complet', description: 'Camere cu două carduri și copii de siguranță în trei locații chiar în aceeași noapte.' },
      { title: 'Design de album', description: 'Albume italiene lucrate manual, create din selecția voastră.' },
    ],
    process: [
      { title: 'Apel de cunoaștere', description: 'Vă cunoaștem pe voi, locația și ce contează cel mai mult.' },
      { title: 'Program și locații', description: 'Le construim împreună cu 4–6 săptămâni înainte de nuntă, cu locuri de portrete aproape de locație.' },
      { title: 'Ziua nunții', description: 'Fotografiem discret, de la pregătiri până la petrecere, oriunde în București sau Ilfov.' },
      { title: 'Galerie și album', description: 'Preview în 72 de ore, galeria completă în 4–6 săptămâni.' },
    ],
    startingPrice: 1200,
    packages: [
      { name: 'Essential', price: 1200, hours: 6, description: 'Cununia civilă sau religioasă, portretele și prima parte a petrecerii.', includes: ['1 fotograf', '6 ore de fotografiere', '400+ fotografii editate', 'Galerie online', 'Fără taxă de deplasare în București și Ilfov'] },
      { name: 'Signature', price: 1900, hours: 10, popular: true, description: 'Cel mai ales pachet de nuntă în București.', includes: ['2 fotografi', '10 ore de fotografiere', '700+ fotografii editate', 'Preview în 72h', 'Galerie online', 'Ședință de logodnă în București'] },
      { name: 'Complete', price: 2800, hours: 14, description: 'Totul, de la pregătiri până la ultima melodie, plus un album.', includes: ['2 fotografi', '14 ore de fotografiere', '900+ fotografii editate', 'Album fine-art 30×30', 'Ședință de logodnă în București', 'Preview a doua zi'] },
    ],
    faqs: [
      { question: 'Câte fotografii vom primi?', answer: 'De obicei 60–80 de fotografii editate pentru fiecare oră — aproximativ 700+ pentru o zi completă cu doi fotografi.' },
      { question: 'Puteți fotografia pregătirile în două zone diferite din București?', answer: 'Da. Cu doi fotografi ne împărțim între pregătirile miresei și ale mirelui — chiar dacă unul e în Sectorul 1 și celălalt în Voluntari — și ne reîntâlnim la biserică sau la locație.' },
    ],
    keywords: ['fotograf nuntă București', 'fotograf nuntă Ilfov', 'fotograf de nuntă București prețuri', 'fotografie de nuntă documentară București'],
  },
  {
    key: 'wedding-film',
    slug: 'videograf-nunta',
    title: 'Videograf de nuntă',
    seo: {
      title: 'Videograf nuntă București și Ilfov | Lumenza',
      description: 'Filmare nuntă în București, Snagov și tot Ilfovul: sunet curat al jurămintelor, cadre cu drona și film highlight de 4–6 minute. Pachete de la 1.500 €.',
    },
    category: 'video',
    order: 2,
    tagline: 'Filme de nuntă din București pe care le veți revedea la fiecare aniversare',
    excerpt: 'Videograf de nuntă în București și Ilfov: filme cinematice cu sunetul real al jurămintelor și discursurilor — un film highlight de 4–6 minute plus ceremonia completă.',
    intro: `Un film de nuntă este singurul mod în care vă puteți auzi din nou jurămintele, puteți revedea discursul tatălui și retrăi ringul de dans exact așa cum a fost.

Filmăm nunți în tot Bucureștiul și Ilfovul cu camere de cinema — din curtea palatului de la Mogoșoaia până în grădinile de pe malul lacului Snagov —, înregistrăm sunet curat de la oficiant și de la discursuri și montăm ca pe un scurtmetraj, cu muzică licențiată corect și color grading făcut manual.

Fiecare pachet video include un film highlight pentru social media, ceremonia și discursurile complete și livrarea prin galeria voastră online privată.`,
    highlights: [
      { title: 'Film highlight', description: 'Montaj cinematic de 4–6 minute, cu muzică licențiată.' },
      { title: 'Sunet curat', description: 'Microfoane wireless pe miri și pe oficiant, plus recorder pentru discursuri.' },
      { title: 'Filmare cu drona', description: 'Pilot de dronă autorizat la Snagov, Mogoșoaia și în alte locații din Ilfov — în București există zone strict restricționate, așa că ne ocupăm noi de avize.' },
      { title: 'Teaser vertical', description: 'Un clip de 60 de secunde în format 9:16 pentru Instagram și TikTok, într-o săptămână.' },
    ],
    process: [
      { title: 'Apel despre povestea voastră', description: 'Vorbim despre ritm, gusturi muzicale și momentele la care țineți.' },
      { title: 'Plan de sunet și program', description: 'Coordonat cu wedding plannerul, DJ-ul sau formația și cu locația.' },
      { title: 'Ziua filmării', description: 'Doi videografi, camere de cinema, gimbaluri și dronă, acolo unde e permis.' },
      { title: 'Montaj și livrare', description: 'Teaser într-o săptămână, filmul complet în 8–10 săptămâni.' },
    ],
    startingPrice: 1500,
    packages: [
      { name: 'Highlights', price: 1500, hours: 8, description: 'Un film highlight frumos al nunții voastre din București sau Ilfov.', includes: ['1 videograf', '8 ore de filmare', 'Film highlight de 4–6 min', 'Muzică licențiată'] },
      { name: 'Story', price: 2400, hours: 12, popular: true, description: 'Film highlight plus ceremonia și discursurile complete.', includes: ['2 videografi', '12 ore de filmare', 'Film highlight', 'Ceremonia și discursurile complete', 'Teaser vertical', 'Dronă (unde e permis)'] },
      { name: 'Feature', price: 3400, hours: 14, description: 'Un film documentar de 15–20 de minute despre ziua voastră.', includes: ['2 videografi', '14 ore de filmare', 'Film documentar de 15–20 min', 'Film highlight', 'Ceremonia și discursurile complete', 'Dronă (unde e permis)'] },
    ],
    faqs: [
      { question: 'Puteți filma cu drona la nunta noastră din București?', answer: 'Centrul Bucureștiului și zona aeroportului Otopeni sunt spații aeriene restricționate, așa că filmările cu drona în oraș sunt rare. În cea mai mare parte a Ilfovului — Snagov, Corbeanca, Mogoșoaia — putem zbura cu avizele necesare, pe care le solicităm noi pentru voi.' },
    ],
    keywords: ['videograf nuntă București', 'filmare nuntă București', 'filmare nuntă Snagov', 'videograf nuntă Ilfov'],
  },
  {
    key: 'brand-video',
    slug: 'video-prezentare-firma',
    title: 'Video de prezentare firmă și brand',
    seo: {
      title: 'Video prezentare firmă București | Lumenza',
      description: 'Producție video în București: filme de prezentare firmă, reclame pentru social media și video-uri de recrutare. De la concept la montajul final în 2 săptămâni.',
    },
    category: 'video',
    order: 3,
    tagline: 'Video-uri pentru firme din București care opresc scroll-ul',
    excerpt: 'Video de prezentare firmă, reclame pentru social media, lansări de produs și video-testimoniale pentru companii din București care vor să arate la fel de bine pe cât sunt.',
    intro: `Un conținut de brand reușit începe cu un brief clar. Vă ajutăm să conturați mesajul, apoi ne ocupăm de tot — scenariu, casting, filmare, montaj și variantele 9:16 de care echipa voastră de social media chiar are nevoie.

Am realizat video-uri de prezentare pentru firme cu birouri în Pipera și Floreasca, filme de recrutare pentru start-up-uri tech și campanii de Reels pentru restaurante și hoteluri din București și Ilfov.

Lucrați cu o singură echipă din București pentru foto și video, așa că fotografiile și filmul se potrivesc mereu — și putem fi la biroul vostru chiar de mâine dimineață.`,
    highlights: [
      { title: 'Concept și scenariu', description: 'Transformăm o idee vagă într-un plan cadru cu cadru.' },
      { title: 'Toate formatele', description: 'Film principal 16:9, plus variante 9:16 și 1:1 pentru fiecare platformă.' },
      { title: 'Foto + video într-o singură zi', description: 'Fotografii asortate, realizate pe același platou, la birou sau în oraș.' },
      { title: 'Livrare rapidă', description: 'Primul montaj în 7 zile lucrătoare.' },
    ],
    process: [
      { title: 'Brief', description: 'Obiective, public, canale și termen limită — la o întâlnire la sediul vostru sau online.' },
      { title: 'Pre-producție', description: 'Scenariu, storyboard, locații în București și autorizații de filmare, actori.' },
      { title: 'Filmare', description: 'Echipă suplă, camere de cinema, lumini și sunet.' },
      { title: 'Post-producție', description: 'Montaj, color, sound design și două runde de modificări.' },
    ],
    startingPrice: 900,
    packages: [
      { name: 'Pachet social', price: 900, hours: 4, description: 'Filmare de o jumătate de zi în București pentru conținut scurt.', includes: ['Filmare de o jumătate de zi', '5 video-uri verticale', 'Subtitrări', '1 rundă de modificări'] },
      { name: 'Film de prezentare', price: 2500, hours: 8, popular: true, description: 'Un video de prezentare a firmei de 60–90 de secunde, plus variante scurte.', includes: ['Concept și scenariu', 'Filmare de o zi întreagă', 'Film principal de 60–90 s', '3 variante pentru social media', '2 runde de modificări'] },
      { name: 'Campanie', price: 5500, hours: 16, description: 'Producție de mai multe zile pentru lansări și reclame.', includes: ['Concept creativ', '2 zile de filmare', 'Film principal', '10+ variante de reclame', 'Pachet de fotografii'] },
    ],
    faqs: [
      { question: 'Emiteți facturi pentru companii?', answer: 'Da, facturăm ca firmă înregistrată în România, cu sediul în București, și putem lucra pe bază de comandă fermă sau contract-cadru.' },
    ],
    keywords: ['video prezentare firmă București', 'producție video București', 'filmare corporate București', 'video de brand București'],
  },
  {
    key: 'event-photo',
    slug: 'fotograf-evenimente-corporate',
    title: 'Fotograf evenimente corporate',
    seo: {
      title: 'Fotograf evenimente corporate București | Lumenza',
      description: 'Fotograf evenimente corporate în București: conferințe, lansări, gale și portrete de echipă la birou. Selecție de fotografii livrată chiar în aceeași zi.',
    },
    category: 'photo',
    order: 4,
    tagline: 'Conferințe, lansări și portrete de echipă în București',
    excerpt: 'Fotograf de evenimente corporate în București — rapid și discret — plus portrete de echipă unitare, cu o selecție livrată în aceeași zi pentru social media.',
    intro: `Evenimentele se mișcă repede, iar noi la fel. Fotografiem conferințe la Romexpo și în marile hoteluri din București, lansări de produs, gale și petreceri corporate cu o abordare discretă, documentară — speakeri, energia publicului, networking și detalii.

Aveți nevoie de conținut cât timp evenimentul încă are loc? Livrăm o selecție în aceeași zi, ca echipa voastră să poată posta în timp real.

Amenajăm și studiouri foto la birou, din Pipera până în centru, astfel încât toată echipa să primească portrete unitare și avantajoase într-o singură după-amiază.`,
    highlights: [
      { title: 'Selecție în aceeași zi', description: '20–40 de fotografii editate, livrate în timpul evenimentului sau imediat după.' },
      { title: 'Studio de portrete la birou', description: 'Până la 40 de persoane pe oră, cu lumină unitară, la sediul vostru din București.' },
      { title: 'Licență comercială', description: 'Folosiți fotografiile în marketing, PR și reclame.' },
    ],
    process: [
      { title: 'Programul evenimentului', description: 'Agenda, persoanele cheie și cadrele obligatorii.' },
      { title: 'Fotografiere', description: 'Discret, rapid și conform programului.' },
      { title: 'Livrare', description: 'Selecție în aceeași zi, galeria completă în 3 zile lucrătoare.' },
    ],
    startingPrice: 450,
    packages: [
      { name: 'Jumătate de zi', price: 450, hours: 4, includes: ['4 ore de fotografiere', '150+ fotografii editate', 'Livrare în 3 zile'] },
      { name: 'Zi întreagă', price: 800, hours: 8, popular: true, includes: ['8 ore de fotografiere', '300+ fotografii editate', 'Selecție în aceeași zi', 'Licență comercială'] },
      { name: 'Zi de portrete', price: 950, hours: 6, includes: ['Studio amenajat la biroul vostru', 'Până la 60 de persoane', 'Portrete retușate', 'Livrare în 48h'] },
    ],
    faqs: [],
    keywords: ['fotograf evenimente corporate București', 'fotograf conferințe București', 'portrete corporate București', 'fotograf eveniment București'],
  },
  {
    key: 'product-photo',
    slug: 'fotografie-produs',
    title: 'Fotografie de produs',
    seo: {
      title: 'Fotografie produs București | Lumenza',
      description: 'Studio de fotografie produs în București: packshot-uri pe fundal alb pentru eMAG și Amazon și imagini lifestyle. Aduceți produsele la studio, în Sectorul 1.',
    },
    category: 'photo',
    order: 5,
    tagline: 'Fotografii de produs pentru magazine online, realizate în București',
    excerpt: 'Fotografie de produs în București: packshot-uri curate pe fundal alb și imagini lifestyle pentru magazine online, eMAG și reclame.',
    intro: `Fotografiile de produs sunt vitrina magazinului vostru. În studioul nostru din București realizăm packshot-uri unitare, cu culori fidele, pe fundal alb pentru eMAG și Amazon, și imagini lifestyle stilizate care arată produsul în context.

Aduceți produsele la studio, în Sectorul 1, sau trimiteți-le prin curier. Totul este fotografiat tethered, ca să puteți aproba imaginile pe loc, iar fișierele sunt livrate în toate dimensiunile de care au nevoie magazinul și platformele de reclame.`,
    highlights: [
      { title: 'Gata pentru marketplace', description: 'Fundal alb pur, conform cerințelor eMAG și Amazon.' },
      { title: 'Culori fidele', description: 'Flux de lucru calibrat, ca produsele să arate exact ca în realitate.' },
      { title: 'Decoruri lifestyle', description: 'Scene stilizate, recuzită și modele, la cerere — în studio sau în locații din București.' },
    ],
    process: [
      { title: 'Lista de cadre', description: 'Unghiuri, încadrări și formate stabilite de la început.' },
      { title: 'Ziua în studio', description: 'Fotografiere tethered în studioul nostru din București, cu aprobare pe loc.' },
      { title: 'Retuș', description: 'Corectăm praful, reflexiile și culorile.' },
    ],
    startingPrice: 300,
    packages: [
      { name: 'Starter', price: 300, hours: 2, includes: ['Până la 10 produse', '3 unghiuri per produs', 'Fundal alb'] },
      { name: 'Catalog', price: 750, hours: 6, popular: true, includes: ['Până la 40 de produse', '3 unghiuri per produs', 'Fundal alb', '10 fotografii lifestyle'] },
      { name: 'Campanie', price: 1600, hours: 8, includes: ['Decoruri lifestyle stilizate', 'Model la cerere', 'Încadrări gata pentru reclame'] },
    ],
    faqs: [],
    keywords: ['fotografie produs București', 'fotograf produs București', 'fotografie e-commerce București', 'studio packshot București'],
  },
  {
    key: 'christening',
    slug: 'fotograf-botez',
    title: 'Fotograf și video botez',
    seo: {
      title: 'Fotograf botez București și Ilfov | Lumenza',
      description: 'Fotograf și video de botez în București și Ilfov: tot ritualul botezului, fără bliț în biserică, portrete de familie și petrecerea. Pachete de la 450 €.',
    },
    category: 'hybrid',
    order: 6,
    tagline: 'Foto și video de botez în București și Ilfov, de la biserică la petrecere',
    excerpt: 'Fotograf de botez în București și Ilfov, discret și atent: ritualul ortodox, nașii, familia și petrecerea de după — în fotografii și film.',
    intro: `Botezul e scurt, emoționant și nu se mai repetă. În douăzeci de minute, preotul, nașii, bebelușul și o biserică plină de rude își joacă fiecare rolul — iar cei mai mulți părinți își amintesc foarte puțin după aceea. Treaba noastră este să puteți retrăi fiecare clipă.

Fotografiem și filmăm botezuri în biserici și mănăstiri din București și Ilfov, discret și fără bliț în timpul slujbei, respectând indicațiile preotului despre unde putem sta. Apoi vă însoțim la restaurant pentru portrete de familie relaxate, urările nașilor, tortul și petrecerea.

Familiile mixte și nașii veniți din străinătate sunt bineveniți: lucrăm în română și engleză și le putem explica invitaților care văd pentru prima dată un botez ortodox ce se întâmplă la fiecare pas.`,
    highlights: [
      { title: 'Fără bliț în biserică', description: 'Obiective luminoase și declanșare silențioasă, ca slujba să rămână liniștită, iar preotul să se simtă confortabil.' },
      { title: 'Fiecare moment al ritualului', description: 'Lepădările, cufundarea în cristelniță, ungerea cu Sfântul Mir, prima împărtășanie și tunderea.' },
      { title: 'Portrete de familie', description: 'Părinți, nași și bunici, fotografiați pe îndelete înainte sau după slujbă.' },
    ],
    process: [
      { title: 'Un apel scurt', description: 'Notăm biserica, restaurantul, invitații și momentele la care țineți.' },
      { title: 'Coordonare cu parohia', description: 'Confirmăm din timp cu biserica regulile pentru fotografiere și ora slujbei.' },
      { title: 'Ziua botezului', description: 'Fotografiem discret slujba, apoi portretele și petrecerea.' },
      { title: 'Galerie și film', description: 'Preview în 72 de ore, galeria completă în 2–3 săptămâni, filmul în 4–6 săptămâni.' },
    ],
    startingPrice: 450,
    packages: [
      { name: 'Foto', price: 450, hours: 3, description: 'Slujba de botez și portretele de familie.', includes: ['1 fotograf', '3 ore de fotografiere', '200+ fotografii editate', 'Galerie online'] },
      { name: 'Foto + video', price: 850, hours: 5, popular: true, description: 'Slujba și petrecerea, în fotografii și un film scurt.', includes: ['1 fotograf', '1 videograf', '5 ore', '250+ fotografii editate', 'Film highlight de 3–4 min'] },
      { name: 'Zi completă', price: 1300, hours: 8, description: 'De la pregătirile de acasă până la tortul de la petrecere.', includes: ['1 fotograf', '1 videograf', '8 ore', '400+ fotografii editate', 'Film highlight', 'Filmarea completă a slujbei'] },
    ],
    faqs: [
      { question: 'Cum se împarte timpul între biserică și restaurant?', answer: 'Ajungem la biserică cu 20–30 de minute înainte, pentru detalii și fotografii cu familia, fotografiem slujba, apoi plecăm înainte spre restaurant ca să surprindem decorul înainte să sosească invitații. În București și Ilfov planificăm traseul ținând cont de traficul de duminică, de obicei lejer.' },
      { question: 'Ce momente ale botezului ortodox surprindeți?', answer: 'Pe toate: lepădările de la intrarea în biserică, sfințirea apei, cufundarea de trei ori în cristelniță, ungerea cu mir, îmbrăcarea în haina albă și lumânarea, tunderea, prima împărtășanie și momentul în care nașii primesc copilul. Dacă sărbătoriți în aceeași zi și împlinirea unui an, fotografiem și tăierea moțului.' },
      { question: 'Când primim fotografiile și filmul?', answer: 'Primiți un preview în 72 de ore, galeria online completă în 2–3 săptămâni și filmul editat în 4–6 săptămâni.' },
    ],
    keywords: ['fotograf botez București', 'fotograf botez Ilfov', 'filmare botez București', 'foto video botez București'],
  },
] as const

export const locations = [
  {
    key: 'bucharest',
    slug: 'bucuresti',
    name: 'București',
    region: 'București',
    isPrimary: true,
    travelFee: 0,
    geo: { lat: 44.4268, lng: 26.1025 },
    intro: `Bucureștiul este acasă. Studioul nostru e în Sectorul 1, iar cele mai multe weekenduri le petrecem undeva între Piața Victoriei și lacurile din nordul orașului — așa că știm ce străduțe din Centrul Vechi sunt goale la 8 dimineața, unde e liniște în Herăstrău sâmbăta și cât durează de fapt drumul de la biserică la restaurant.

Capitala vă oferă toate decorurile într-o singură zi: palatele Belle Époque de pe Calea Victoriei, coloanele neoclasice ale Ateneului, vilele umbrite din Cotroceni și Dorobanți și sticla modernă din Floreasca. Primăvara, magnoliile și teii luminează parcurile; toamna, Cișmigiul se îmbracă în auriu pe la jumătatea lui octombrie.

Ca fotograf de nuntă în București acoperim nunți, ședințe de logodnă, evenimente corporate și filmări de brand în tot orașul, fără taxă de deplasare în niciun sector.`,
    venues: [
      { name: 'Parcul Regele Mihai I (Herăstrău)', description: 'Lacul, rozariul și grădina japoneză — alegerea clasică pentru portretele de nuntă din nordul orașului.' },
      { name: 'Ateneul Român', description: 'Emblematica sală de concerte neoclasică, cu parcul din față — portrete urbane elegante.' },
      { name: 'Centrul Vechi și Pasajul Macca-Villacrosse', description: 'Străzi pietruite, pasajul acoperit cu sticlă și curtea Mănăstirii Stavropoleos.' },
      { name: 'Parcul Cișmigiu', description: 'Cel mai vechi parc din București — lac, poduri și copaci bătrâni, superb toamna.' },
      { name: 'Grădina Botanică „Dimitrie Brândză”', description: 'Sere și alei liniștite în Cotroceni; este necesară o autorizație foto.' },
    ],
    nearbyAreas: ['Sectorul 1', 'Dorobanți', 'Floreasca', 'Cotroceni', 'Băneasa', 'Herăstrău'],
    serviceNotes: [],
    faqs: [
      { question: 'Există taxă de deplasare în București?', answer: 'Nu — toate sectoarele Bucureștiului sunt incluse, la fel și întregul județ Ilfov.' },
      { question: 'Unde putem face o ședință scurtă de portrete între biserică și restaurant?', answer: 'Depinde de traseu: în centru merg foarte bine Cișmigiul și Ateneul, în nord Herăstrăul și zona Casa Doina. Planificăm o oprire de 20–30 de minute care să evite orele de vârf.' },
    ],
  },
  {
    key: 'ilfov',
    slug: 'judetul-ilfov',
    name: 'Județul Ilfov',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.5355, lng: 26.0857 },
    intro: `Ilfovul înconjoară Bucureștiul ca un inel verde și este, de fapt, locul unde petrec cele mai multe cupluri din Capitală. La 20–40 de minute de oraș găsiți palate domnești, mănăstiri pe malul lacurilor, grădini la marginea pădurii și saloane moderne uriașe, care nu ar încăpea niciodată în oraș.

Pentru că județul e atât de aproape, o nuntă în Ilfov este de obicei un amestec: pregătiri într-un apartament din București, cununia religioasă într-o biserică din oraș sau la o mănăstire din afara lui, apoi petrecerea într-o locație cu grădină la Buftea, Snagov, Corbeanca sau Otopeni. Construim programul în funcție de A3, DN1 și centură, ca nimeni să nu aștepte în trafic.

Și lumina e altfel aici — câmpurile deschise și lacurile oferă vara apusuri lungi și blânde, perfecte pentru portretele de la ora de aur. Ca fotograf de nuntă în Ilfov, deplasarea oriunde în județ este mereu inclusă.`,
    venues: [
      { name: 'Palatul Știrbey, Buftea', description: 'Palat din secolul al XIX-lea, cu parc pe malul lacului Buftea — un decor romantic pentru ceremonii și portrete.' },
      { name: 'Mănăstirea Cernica', description: 'Mănăstire pe două insule ale lacului Cernica, la est de București — liniștită și foarte fotogenică.' },
      { name: 'Mănăstirea Căldărușani', description: 'Mănăstire istorică pe malul lacului, lângă Gruiu, ideală pentru o cununie religioasă departe de oraș.' },
      { name: 'Therme București, Balotești', description: 'Seră tropicală și grădini cu palmieri — un decor neobișnuit pentru filmări de brand și ședințe creative (cu acord).' },
    ],
    nearbyAreas: ['Buftea', 'Chitila', 'Pantelimon', 'Popești-Leordeni', 'Bragadiru', 'Măgurele'],
    serviceNotes: [
      {
        service: 'wedding-photo',
        content: `Majoritatea nunților bucureștenilor au loc, de fapt, în Ilfov — în saloane mari, în grădini de palat precum cea a Palatului Știrbey din Buftea sau în apropierea mănăstirilor Cernica și Căldărușani. Numitorul comun este distanța: biserica poate fi în oraș, iar locația la 30 de km, așa că ne construim programul în jurul centurii, al A3 și al DN1 și, la nevoie, trimitem un fotograf înainte.

Pentru portrete alegem locuri aflate în drum, fără ocoluri inutile: parcul Palatului Știrbey, malul lacului Buftea sau al lacului Cernica ori câmpurile din jurul locației, la ora de aur. Saloanele din Ilfov sunt adesea uriașe și întunecate seara, așa că luminăm ringul de dans cu blițuri externe, pentru fotografii de petrecere clare și pline de culoare.`,
      },
      {
        service: 'wedding-film',
        content: `Filmarea unei nunți în Ilfov înseamnă distanțe lungi și săli mari. Lucrăm cu doi videografi, ca să acoperim atât pregătirile miresei, cât și pe ale mirelui — de multe ori în zone diferite ale Bucureștiului — și ne reunim la biserică sau la locație. Saloanele mari cer atenție în plus la sunet: îl preluăm direct din pupitrul formației sau al DJ-ului și punem un recorder de rezervă lângă cei care țin discursuri.

În afara zonei aeroportului, în mare parte din Ilfov se poate zbura cu drona, cu înregistrarea zborului în regulă, așa că filmările aeriene ale locațiilor din jurul Buftei, Cernicăi sau Gruiului sunt de obicei posibile. Verificăm locul exact și depunem cererea cu circa două săptămâni înainte; dacă zborul nu e permis, planificăm cadre cinematice de la sol.`,
      },
      {
        service: 'event-photo',
        content: `Dincolo de zonele de birouri ale Bucureștiului, în Ilfov se întâmplă multe evenimente corporate: team building-uri în complexuri de lângă lacuri, petreceri de vară în grădini de evenimente, inaugurări de depozite și fabrici de-a lungul A1 și al centurii, conferințe în hotelurile din jurul orașului. Le acoperim pe toate fără taxă de deplasare.

Evenimentele de firmă în aer liber depind de vreme și de lumină, așa că stabilim cu organizatorul un plan pentru ploaie și facem pozele de grup înainte ca soarele de prânz să devină prea dur. Pe șantiere și în spații industriale respectăm regulile de siguranță — cască, vestă, zone restricționate — și ne coordonăm din timp cu responsabilul de sit. Selecția din aceeași zi o trimitem prin date mobile, chiar și din locații izolate.`,
      },
      {
        service: 'christening',
        content: `Multe familii din București aleg să facă botezul în Ilfov: slujba la o mănăstire precum Cernica sau Căldărușani ori la parohia de acasă, din Popești-Leordeni, Bragadiru sau Chitila, apoi masa la un restaurant cu grădină, unde copiii se pot juca. Fotografiem ritualul botezului, nașii, familia și petrecerea.

Bisericile mănăstirilor sunt adesea întunecoase și aglomerate duminica, așa că stabilim ora cu parohia și fotografiem fără bliț în timpul slujbei. Dacă restaurantul e mai departe de biserică, planificăm drumul astfel încât bebelușul să se poată odihni, iar pauza o folosim pentru portrete relaxate cu părinții și nașii, în grădină.`,
      },
    ],
    faqs: [
      { question: 'Percepeți taxă de deplasare undeva în Ilfov?', answer: 'Nu. Toate localitățile din județul Ilfov sunt acoperite fără cost suplimentar. O taxă mică se aplică doar locațiilor aflate la peste 40 km de București.' },
      { question: 'Cum gestionați drumul din București până la locație?', answer: 'Verificăm traseul și traficul pentru data și ora voastră, includem rezerve de timp în program și, la nevoie, unul dintre noi pleacă înainte la locație ca să fotografieze detaliile înainte să ajungeți.' },
    ],
  },
  {
    key: 'snagov',
    slug: 'snagov',
    name: 'Snagov',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.7006, lng: 26.1853 },
    intro: `Snagovul este refugiul de pe malul lacului al bucureștenilor — 40 de minute spre nord pe DN1 și sunteți printre păduri, pontoane private și locații de evenimente chiar pe apă. Este unul dintre cele mai căutate locuri pentru nunțile de vară din apropierea Capitalei, și pe bună dreptate.

Lacul lung și îngust oferă reflexii superbe seara, iar multe locații sunt pregătite pentru intrarea mirilor cu barca, ceremonii pe ponton și petreceri sub copaci. Din iunie până în august, apusul văzut de pe malul vestic este spectaculos; în septembrie, diminețile aduc ceață deasupra apei — perfectă pentru portrete.

Pentru filmare nuntă la Snagov cunoaștem pontoanele, drumurile de acces care se aglomerează vinerea după-amiaza și locurile care arată cel mai bine din dronă. Nu se aplică taxă de deplasare.`,
    venues: [
      { name: 'Lacul Snagov', description: 'Stuf, pontoane și plimbări cu barca — reflexii la apus și ceață dimineața, la început de toamnă.' },
      { name: 'Mănăstirea Snagov', description: 'Mănăstire medievală pe insula din mijlocul lacului, la care se ajunge cu barca sau pe pasarelă.' },
      { name: 'Palatul Snagov', description: 'Palat în stil neoromânesc, cu un parc care coboară până la lac.' },
      { name: 'Rezervația Pădurea Snagov', description: 'Pădure veche de stejar și frasin de-a lungul malului — lumină verde și blândă pentru portretele de vară.' },
    ],
    nearbyAreas: ['Ciolpani', 'Gruiu', 'Periș', 'Tâncăbești', 'Ghermănești'],
    serviceNotes: [
      {
        service: 'wedding-photo',
        content: `O nuntă la Snagov înseamnă de obicei pregătiri în București, 40 de minute de drum spre nord pe DN1 și o cununie pe ponton sau pe gazon, chiar lângă apă. Trimitem un fotograf înainte, ca să surprindă locația, decorul și sosirea invitaților, în timp ce celălalt rămâne cu voi — așa nu se pierde nimic pe drum.

Cele mai frumoase portrete le facem pe pontoane și printre stufăriș, în ultima oră dinaintea apusului, când lacul capătă reflexe de aramă. Dacă locația voastră e pe malul estic, o scurtă plimbare cu barca ne pune cu fața spre lumină. În septembrie vă propunem adesea o ședință scurtă, dimineața, în ceața de pe lac, a doua zi după nuntă — imagini pe care foarte puține cupluri le au.`,
      },
      {
        service: 'wedding-film',
        content: `Lacul Snagov este unul dintre puținele locuri din jurul Bucureștiului în care un film de nuntă chiar are loc să respire: cadre aeriene deasupra apei, intrarea mirilor cu barca, plimbări lungi filmate cu gimbalul prin Pădurea Snagov. Pentru filmare nuntă Snagov cu drona e nevoie de înregistrarea zborului și, în funcție de locul exact, de aviz de la autoritățile aeronautice — depunem cererea cu aproximativ două săptămâni înainte.

În ziua nunții punem microfoane pe oficiant și pe miri pentru ceremonia de pe ponton, pentru că vântul dinspre lac strică sunetul înregistrat de cameră. Cadrele de seară le gândim în funcție de apusul de pe malul vestic, iar pentru petrecere venim cu lumini suplimentare, fiindcă multe corturi de pe malul lacului rămân în întuneric după ce apune soarele.`,
      },
      {
        service: 'christening',
        content: `Multe familii din București îmbină botezul la o biserică din Snagov sau Ciolpani cu masa la un restaurant pe malul lacului. Fotografiem slujba în biserică, apoi familia lângă apă, înainte ca invitații să se așeze la masă — câțiva pași până la ponton vă aduc cea mai blândă lumină a zilei.

Duminicile de vară, DN1 poate fi aglomerat cu bucureștenii care pleacă spre lac, așa că ne vedem de obicei la biserică cu 30 de minute înainte de slujbă. Pentru film, nașii ținând bebelușul în brațe pe malul apei sunt un cadru final superb; cu pachetul de zi completă rămânem și la tort și la petrecerea de la restaurant.`,
      },
    ],
    faqs: [
      { question: 'Putem filma nunta pe lacul Snagov cu drona?', answer: 'În cea mai mare parte a zonei Snagov, da, cu avizele necesare — le solicităm din timp și verificăm regulile locației voastre.' },
      { question: 'Care este cel mai bun moment pentru portrete la Snagov?', answer: 'Ultima oră dinaintea apusului, din iunie până în august, sau dimineața devreme în septembrie, când e ceață pe lac.' },
    ],
  },
  {
    key: 'corbeanca',
    slug: 'corbeanca',
    name: 'Corbeanca',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.6044, lng: 26.0436 },
    intro: `Corbeanca este partea liniștită și verde a nordului Ilfovului — la aproximativ 30 de minute de București, între pădure și câmpuri. Multe cupluri o aleg pentru nunți restrânse în grădină, petreceri în vile private și evenimente relaxate în aer liber, departe de zgomotul orașului.

Ce ne place cel mai mult aici este spațiul: câmpuri care strălucesc la apus, ulițe cu copaci în satele Tamași și Ostratu și marginea Pădurii Corbeanca, la doar câteva minute. Este locul ideal pentru portrete naturale, nepozate, și pentru ședințe de logodnă cu aer de la țară.

În sâmbetele aglomerate, drumul prin Otopeni și Balotești se încarcă repede, așa că planificăm atent deplasarea. Ca peste tot în Ilfov, nu se aplică taxă de deplasare.`,
    venues: [
      { name: 'Pădurea Corbeanca', description: 'Marginea pădurii de stejar, cu lumină filtrată și blândă — superbă pentru portrete vara și toamna.' },
      { name: 'Grădinile de evenimente din Corbeanca', description: 'Grădini și vile private pentru cununii restrânse și petreceri în aer liber.' },
      { name: 'Ulițele din Tamași și Ostratu', description: 'Drumuri de țară, câmpuri și apusuri pentru ședințe de logodnă relaxate.' },
    ],
    nearbyAreas: ['Tamași', 'Ostratu', 'Petrești', 'Balotești', 'Săftica'],
    serviceNotes: [
      {
        service: 'wedding-photo',
        content: `Nunțile în grădină din Corbeanca sunt de obicei restrânse și relaxate: cununie pe gazon, mese lungi sub copaci și dans până târziu. Drumul din nordul Bucureștiului durează cam 30 de minute, dar sâmbătă după-amiaza traseul prin Otopeni și Balotești poate dura de două ori mai mult, așa că pregătirile din oraș trebuie să înceapă adesea mai devreme decât s-ar aștepta mirii.

Pentru portrete ne plac mult câmpurile din jurul satelor Tamași și Ostratu — iarbă înaltă și cer larg la ora de aur — iar în lunile caniculare, marginea umbrită a Pădurii Corbeanca, unde lumina de la prânz nu mai e atât de dură. Multe locații de aici sunt grădini private, așa că verificăm din timp unde apune soarele față de mese și planificăm toasturile în consecință.`,
      },
      {
        service: 'wedding-film',
        content: `Corbeanca se potrivește unui film natural, documentar: puțini invitați, conversații reale, discursuri sincere în grădină. Cu mai puțini oameni, filmul se sprijină mai mult pe sunet curat decât pe spectacol — microfoane lavalieră pe miri și un recorder pentru fiecare vorbitor, ca nicio vorbă a prietenilor voștri să nu se piardă în briza de seară.

Corbeanca e suficient de departe de aeroport încât, de obicei, putem zbura cu drona, cu zborul înregistrat, iar câmpurile și pădurea arată spectaculos de sus la apus. Verificăm din timp grădinile private — prize, un colț liniștit pentru scurte interviuri — și planificăm o plimbare la ora de aur pe ulițele satului, care devine adesea secvența de deschidere a filmului.`,
      },
      {
        service: 'christening',
        content: `În Corbeanca, botezurile sunt de multe ori sărbători mici, în familie: slujba la biserica din sat, apoi masa în grădină sau acasă. Fotografiem ritualul botezului — cufundarea în cristelniță, ungerea cu mir, lumânările nașilor — fără bliț și din unghiuri discrete, cu care preotul e de acord.

După slujbă, grădina e locul perfect pentru portrete de familie naturale și fotografii jucăușe cu bebelușul, verișorii și bunicii. Corbeanca e la circa 30 de minute de București, fără taxă de deplasare, iar duminica dimineața drumurile sunt libere, așa că putem acoperi ușor o slujbă de dimineață și rămâne și la masă.`,
      },
    ],
    faqs: [
      { question: 'Fotografiați și nunți mici în Corbeanca?', answer: 'Da — nunțile restrânse în grădină, cu 30–80 de invitați, sunt printre preferatele noastre. De multe ori, pachetul Essential este suficient.' },
      { question: 'Putem face o ședință de logodnă în Corbeanca?', answer: 'Sigur. Câmpurile și marginea pădurii arată minunat în ultima oră dinaintea apusului și le putem combina cu o oprire la lacul Snagov.' },
    ],
  },
  {
    key: 'mogosoaia',
    slug: 'mogosoaia',
    name: 'Mogoșoaia',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.5292, lng: 25.9997 },
    intro: `La Mogoșoaia se află una dintre cele mai fotografiate clădiri din jurul Bucureștiului: palatul brâncovenesc ridicat în 1702, cu loggia, piatra sculptată și grădinile care coboară spre lac. La doar 15–20 de minute de nord-vestul orașului, este un favorit pentru cununii, portrete de nuntă și ședințe de logodnă.

Palatul arată complet diferit de la un anotimp la altul — glicină și verde crud în mai, piatră caldă și umbre lungi vara, copaci aurii oglindiți în lac în octombrie. Grădinile pot fi aglomerate în după-amiezile de weekend, așa că alegem momentele mai liniștite și știm colțurile în care încă puteți avea locul doar pentru voi.

Fotografierea în incinta complexului poate presupune o taxă de acces, de care ne ocupăm din timp. Nu se aplică taxă de deplasare.`,
    venues: [
      { name: 'Palatul Mogoșoaia', description: 'Palat în stil brâncovenesc, cu loggia arcuită și curte interioară — unul dintre cele mai elegante decoruri din jurul Bucureștiului.' },
      { name: 'Grădinile și lacul de la Mogoșoaia', description: 'Grădini, aleea de pe malul lacului și copaci bătrâni pentru portrete naturale.' },
      { name: 'Biserica Sfântul Gheorghe', description: 'Biserica brâncovenească din 1688, aflată în incinta palatului.' },
      { name: 'Vila Elchingen', description: 'Vila romantică din parcul palatului, un colț mai liniștit pentru portrete.' },
    ],
    nearbyAreas: ['Chitila', 'Buftea', 'Bucureștii Noi', 'Străulești', 'Otopeni'],
    serviceNotes: [
      {
        service: 'wedding-photo',
        content: `Palatul brâncovenesc vă oferă una dintre cele mai elegante ședințe de portrete din jurul Bucureștiului: arcadele loggiei, balustradele din piatră sculptată și malul lacului mărginit de copaci bătrâni. Complexul percepe o taxă de acces pentru fotografia profesională și are program de vizitare fix, așa că rezervăm din timp intervalul și programăm portretele în momentele mai liniștite — de obicei după-amiaza târziu, în zilele lucrătoare, sau chiar înainte de închidere, în weekend.

Mogoșoaia este la doar 15–20 de minute de nord-vestul Bucureștiului, prin Bucureștii Noi, așa că o ședință de portrete se potrivește ușor între o biserică din oraș și o locație din altă parte a Ilfovului. În mai, glicina de pe fațadă e spectaculoasă; în octombrie, reflexiile din lac sunt la apogeu.`,
      },
      {
        service: 'wedding-film',
        content: `Pentru un film de nuntă, Mogoșoaia oferă texturi bogate — piatră, arcade, lumina care cade prin loggia — care arată cinematic aproape fără efort. Filmarea în incinta complexului necesită acordul palatului și plata taxei, de care ne ocupăm noi; gimbalul și trepiedul nu sunt o problemă, în schimb drona are nevoie de un zbor înregistrat și, atât de aproape de oraș, de un aviz pe care îl cerem cu mult timp înainte.

De obicei rezervăm 30–40 de minute de filmare cu mirii în grădini, la ora la care soarele coboară în spatele palatului. Dacă ceremonia are loc chiar acolo, punem microfon pe oficiant și înregistrăm sunetul ambiental din curte, care are un ecou superb și dă filmului un adevărat sentiment al locului.`,
      },
      {
        service: 'christening',
        content: `Dacă familia voastră a stabilit botezul la Biserica Sfântul Gheorghe din incinta palatului, ridicată în 1688, aveți un cadru cu adevărat deosebit: un interior mic, pictat, și lumină blândă care intră prin ferestrele înguste. Fotografiem fără bliț, respectăm indicațiile preotului și surprindem de aproape cufundarea, ungerea cu mir și prima împărtășanie.

După slujbă, o scurtă plimbare prin grădinile palatului vă aduce portrete de familie cu un decor pe care puține botezuri îl au. Complexul are program de vizitare și taxe, așa că lămurim detaliile cu voi și cu parohia dinainte. Mogoșoaia e la 15–20 de minute de București și se combină ușor cu un restaurant din nordul orașului.`,
      },
    ],
    faqs: [
      { question: 'Avem nevoie de autorizație pentru fotografii la Palatul Mogoșoaia?', answer: 'Pentru fotografie și filmare de nuntă, complexul percepe de obicei o taxă de acces. Verificăm regulile în vigoare și ne ocupăm de ea înainte de data voastră.' },
      { question: 'Când este Mogoșoaia cel mai puțin aglomerată?', answer: 'Dimineața, în zilele lucrătoare, și în ultima oră înainte de închidere. Sâmbăta planificăm o ședință scurtă și eficientă, în afara orelor de vârf.' },
    ],
  },
  {
    key: 'voluntari',
    slug: 'voluntari-pipera',
    name: 'Voluntari și Pipera',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.4925, lng: 26.1764 },
    intro: `Voluntari și Pipera se află chiar la marginea de nord-est a Bucureștiului și sunt locul unde se desfășoară o mare parte din viața de business a orașului. În clădirile de birouri din Pipera lucrează firme de tehnologie, bănci și multinaționale — de aceea aici filmăm cele mai multe video-uri de prezentare a firmei, campanii de recrutare și zile de portrete pentru echipe.

Fațadele de sticlă și piațetele deschise dau un aspect curat și modern, perfect pentru conținutul de brand, mai ales în lumina blândă a dimineții, înainte să se aglomereze zona. Pentru cuplurile care locuiesc în noile cartiere rezidențiale de aici, fotografiem și pregătirile și cununia civilă de la primăria Voluntari.

Traficul pe arterele principale din Pipera este intens la orele de vârf, așa că programăm filmările la birou între 10:00 și 16:00. Nu se aplică taxă de deplasare.`,
    venues: [
      { name: 'Zona de birouri Pipera', description: 'Turnuri de sticlă și piațete — un decor modern pentru video corporate și portrete de echipă.' },
      { name: 'Pădurea Băneasa', description: 'Pădure întinsă chiar la vest de Pipera, pentru filmări de brand în aer liber și portrete relaxate.' },
      { name: 'Romexpo', description: 'Principalul centru expozițional al Bucureștiului, la câteva minute, pentru târguri și conferințe.' },
    ],
    nearbyAreas: ['Pipera', 'Ștefăneștii de Jos', 'Afumați', 'Dobroești', 'Tunari'],
    serviceNotes: [
      {
        service: 'wedding-photo',
        content: `Multe cupluri care locuiesc în noile cartiere din Voluntari și Pipera se pregătesc acasă și au cununia civilă la primăria Voluntari, apoi pleacă spre București sau spre nordul Ilfovului, la biserică și la petrecere. Planificăm ziua astfel încât fotograful să ajungă la voi acasă cu suficient timp pentru detalii și portrete de familie înainte de cununia civilă.

Pentru portrete, Pădurea Băneasa e la zece minute și oferă o lumină verde și blândă chiar și în miezul verii. Arterele principale din Pipera sunt aglomerate în serile din timpul săptămânii și sâmbăta dimineața, așa că pentru o cununie civilă de vineri lăsăm rezerve generoase de timp. Clădirile moderne din jur sunt, în plus, un decor curat, editorial, pentru câteva portrete chiar lângă casa voastră.`,
      },
      {
        service: 'event-photo',
        content: `Pipera este centrul de business al Bucureștiului, iar o mare parte din proiectele noastre corporate au loc aici: ședințe generale, lansări de produs, zile de echipă și petreceri de birou. Cunoaștem regulile clădirilor — ecusoane de acces, parcare, înregistrarea echipamentului la recepție — și le rezolvăm din timp cu office managerul vostru.

Ca fotograf evenimente corporate în Pipera, pentru evenimentele interne și conferințe venim de obicei cu un fotograf și lumină discretă și livrăm o selecție chiar în aceeași zi, pentru intranet sau LinkedIn. Zilele de portrete se organizează într-o sală de ședințe: studio portabil, lumină constantă și până la 40 de persoane pe oră, programate între 10:00 și 16:00, ca să evităm orele de vârf.`,
      },
      {
        service: 'christening',
        content: `Voluntari e plin de familii tinere, iar botezurile de aici au loc de obicei la bisericile parohiale din oraș, urmate de masa la un restaurant din Pipera sau din nordul Bucureștiului. Fotografiem slujba — cufundarea în cristelniță, ungerea cu mir, momentul în care nașii primesc copilul — și apoi întâlnirea cu familia la restaurant.

Pentru că biserica și restaurantul sunt adesea la doar câteva minute distanță, pachetul foto de 3 ore acoperă de multe ori totul. Duminica traficul e lejer, așa că putem adăuga și o scurtă ședință de familie acasă, înainte de slujbă, cât bebelușul e încă odihnit și bine dispus.`,
      },
    ],
    faqs: [
      { question: 'Puteți filma un video de prezentare a firmei la biroul nostru din Pipera?', answer: 'Da. Venim cu o echipă suplă, cu lumini și sunet, ne adaptăm programului echipei voastre și putem livra și fotografii din aceeași zi.' },
      { question: 'Organizați zile de portrete pentru firme din Voluntari?', answer: 'Da — amenajăm un studio portabil într-o sală de ședințe și fotografiem până la 40 de persoane pe oră.' },
    ],
  },
  {
    key: 'otopeni',
    slug: 'otopeni',
    name: 'Otopeni',
    region: 'Ilfov',
    isPrimary: false,
    travelFee: 0,
    geo: { lat: 44.55, lng: 26.07 },
    intro: `Otopeni este cunoscut mai ales pentru Aeroportul Internațional Henri Coandă, dar pentru noi este poarta spre nordul Ilfovului — și o bază practică pentru nunțile cu invitați care vin din străinătate. Multe cupluri din diaspora aleg o locație lângă Otopeni, ca rudele să aterizeze dimineața și să danseze în aceeași seară.

Hotelurile și centrele de conferințe din jurul aeroportului găzduiesc și evenimente corporate, lansări de produs și petreceri de firmă, pe care le fotografiem și le filmăm des. Therme București, din Balotești, este la zece minute, pentru ședințe de brand neobișnuite și colorate.

Lângă aeroport nu se poate zbura cu drona, așa că aici ne concentrăm pe cadre cinematice de la sol. Deplasarea este mereu inclusă.`,
    venues: [
      { name: 'Aeroportul Internațional Henri Coandă', description: 'Momentele sosirii pentru invitați și pentru cuplurile care vin acasă să se căsătorească.' },
      { name: 'Hoteluri de conferințe lângă aeroport', description: 'Saloane și săli de evenimente pentru evenimente corporate și nunți mari.' },
      { name: 'Therme București, Balotești', description: 'Grădini sub cupolă de sticlă, la zece minute, pentru conținut de brand creativ (cu acord).' },
    ],
    nearbyAreas: ['Tunari', 'Balotești', 'Corbeanca', 'Băneasa'],
    serviceNotes: [
      {
        service: 'wedding-photo',
        content: `Nunțile de lângă Otopeni sunt alese adesea de cuplurile cu invitați din străinătate: rudele aterizează dimineața, se cazează la un hotel de lângă aeroport și ajung la petrecere seara. Dacă vă doriți, fotografiem sosirile, apoi ceremonia și petrecerea într-unul dintre saloanele mari din jurul aeroportului, care sunt luminoase, spațioase și ușor de iluminat.

Pentru portrete facem de obicei un drum scurt până în Pădurea Băneasa sau pe ulițele mai liniștite spre Corbeanca, la 10–15 minute. Lângă aeroport nu se poate zbura cu drona, așa că ne concentrăm pe imagini puternice de la sol — iar un avion care decolează la apus poate deveni un fundal spectaculos și jucăuș pentru un portret de cuplu.`,
      },
      {
        service: 'event-photo',
        content: `Hotelurile și centrele de conferințe din jurul Aeroportului Henri Coandă găzduiesc multe evenimente corporate: întâlniri internaționale, lansări de produs, gale de premiere și petreceri de firmă cu invitați care vin doar pentru o zi. Suntem obișnuiți cu programe strânse — check-in dimineața, sesiuni după-amiaza, cină festivă seara — și ne organizăm acoperirea pe fiecare bloc în parte.

Sălile de conferințe de lângă aeroport au adesea lumină mixtă și tavane joase, așa că venim cu blițuri pentru lumină reflectată și obiective luminoase, ca tonurile pielii să rămână naturale. Selecția din aceeași zi poate fi gata înainte ca participanții să plece spre avion, lucru apreciat de companiile internaționale: conținutul apare cât toată lumea încă vorbește despre eveniment.`,
      },
    ],
    faqs: [
      { question: 'Mulți dintre invitații noștri vin cu avionul — Otopeni e o alegere bună?', answer: 'Foarte bună. Locațiile de lângă aeroport simplifică logistica, iar sosirea familiei poate deveni chiar parte din povestea nunții voastre.' },
      { question: 'Puteți folosi drona în Otopeni?', answer: 'Nu — zona din jurul aeroportului este spațiu aerian restricționat. Planificăm în schimb cadre cinematice de la sol sau adăugăm filmări aeriene într-o a doua locație, mai departe de aeroport.' },
    ],
  },
] as const

export const testimonials = [
  { key: 't1', name: 'Ana & Mihai', role: 'Nuntă la Palatul Mogoșoaia', service: 'wedding-photo', rating: 5, featured: true, quote: 'Ne uităm la galerie în fiecare zi de atunci. Au prins momente despre care nici nu știam că s-au întâmplat — tata plângând la primul dans mă emoționează de fiecare dată.' },
  { key: 't2', name: 'Elena & Radu', role: 'Film de nuntă, Snagov', service: 'wedding-film', rating: 5, featured: true, quote: 'Filmul e ireal. Să ne auzim din nou jurămintele peste cadrele acelea cu lacul la apus… toată familia l-a văzut de zeci de ori.' },
  { key: 't3', name: 'Cristina Popescu', role: 'Marketing Lead, start-up fintech din Pipera', service: 'brand-video', rating: 5, featured: true, quote: 'Brief luni, primul montaj săptămâna următoare, video de lansare online în două săptămâni. Reclamele noastre de recrutare n-au performat niciodată mai bine.' },
  { key: 't4', name: 'Bogdan Ilie', role: 'Event Manager, TechSummit București', service: 'event-photo', rating: 5, featured: false, quote: 'Datorită selecției livrate în aceeași zi, echipa de social media a postat cât oamenii erau încă în sală la Romexpo. Profesioniști și invizibili.' },
  { key: 't5', name: 'Ioana & Alex', role: 'Nuntă în Centrul Vechi din București', service: 'wedding-photo', rating: 5, featured: false, quote: 'Calmi, amuzanți și foarte organizați. Programul pe care l-au construit ne-a salvat ziua când a început să plouă în Centrul Vechi.' },
  { key: 't6', name: 'Maria Stanciu', role: 'Fondatoare, brand de ceramică din București', service: 'product-photo', rating: 5, featured: false, quote: 'Rata de conversie a crescut după ce am înlocuit fotografiile de produs cu cele noi. Culorile sunt exact cum trebuie.' },
  { key: 't7', name: 'Diana & Paul', role: 'Nuntă la Palatul Știrbey, Buftea', service: 'wedding-film', rating: 4, featured: false, quote: 'Un film superb și o comunicare excelentă. L-am fi vrut puțin mai repede, dar a meritat așteptarea.' },
] as const

export const projects = [
  {
    key: 'p1', slug: 'nunta-palatul-mogosoaia-ana-mihai', title: 'Ana & Mihai — Ora de aur la Palatul Mogoșoaia', service: 'wedding-photo', location: 'mogosoaia', venue: 'Palatul Mogoșoaia, Ilfov', clientType: 'Cuplu', date: '2026-06-14', featured: true, testimonial: 't1',
    excerpt: 'O nuntă de vară relaxată la Palatul Mogoșoaia, cu ceremonie în grădină la apus și petrecere sub ghirlande de lumini, lângă lac.',
    brief: 'Ana și Mihai își doreau fotografii documentare care să pară făcute de prietenii lor — doar că mai bune. Fără poze de grup rigide, cu multe momente spontane și câteva portrete sub loggia palatului, la ora de aur.',
    approach: `## Planificare în funcție de lumină
Am mutat ceremonia cu 40 de minute mai târziu, astfel încât mirii au ieșit din grădină direct în ora de aur. O vizită de recunoaștere cu două săptămâni înainte ne-a arătat exact când intră soarele printre arcadele loggiei.

## Doi fotografi, două povești
- Unul dintre noi a fotografiat pregătirile miresei în Dorobanți, celălalt pe ale mirelui în Bucureștii Noi
- La cocktail, unul a rămas cu invitații, iar celălalt a luat mirii la o plimbare de 15 minute pe malul lacului
- Ne-am reunit pentru discursuri și primul dans`,
    result: 'Ana și Mihai au primit 780 de fotografii editate și un preview în 72 de ore, pe care l-au folosit pentru cartonașele de mulțumire. Galeria lor a fost vizualizată de peste 3.000 de ori de familie și prieteni.',
    deliverables: ['780 de fotografii editate', 'Preview în 72h', 'Album 30×30'], tags: ['palat', 'vară', 'ora de aur', 'Mogoșoaia'],
  },
  {
    key: 'p2', slug: 'filmare-nunta-snagov-elena-radu', title: 'Elena & Radu — Film de nuntă pe malul lacului Snagov', service: 'wedding-film', location: 'snagov', venue: 'Lacul Snagov, Ilfov', clientType: 'Cuplu', date: '2026-09-05', featured: true, testimonial: 't2',
    excerpt: 'Un film de nuntă cinematic, cu cadre din dronă deasupra lacului Snagov, cununie pe ponton și jurăminte înregistrate cu un sunet impecabil.',
    brief: 'Elena și Radu își doreau un film care să arate ca un trailer de cinema — cadre largi cu lacul și pădurea — dar și sunetul intim al jurămintelor scrise de mână.',
    approach: `## Mai întâi sunetul
Am pus microfoane lavalieră wireless pe amândoi și pe oficiant și am înregistrat discursurile direct din pupitrul DJ-ului.

## Dronă și gimbal
Cu avizele obținute din timp, pilotul nostru autorizat a filmat lacul la apus, iar pentru cadrele lungi de mers prin Pădurea Snagov am folosit gimbaluri.`,
    result: 'Un film highlight de 5 minute, un montaj documentar de 22 de minute și un teaser vertical care a strâns 40.000 de vizualizări pe Instagram.',
    deliverables: ['Film highlight de 5 min', 'Montaj documentar de 22 min', 'Teaser vertical de 60 s'], tags: ['lac', 'dronă', 'film', 'Snagov'],
  },
  {
    key: 'p3', slug: 'video-prezentare-firma-fintech-pipera', title: 'Film de lansare fintech — 90 de secunde care au adus 20 de ingineri', service: 'brand-video', location: 'voluntari', venue: 'Birou și terasă, Pipera', clientType: 'Start-up tech', date: '2026-04-20', featured: true, testimonial: 't3',
    excerpt: 'Un video de prezentare a firmei și de recrutare pentru un start-up fintech din Pipera, cu fotografii asortate și variante scurte pentru social media.',
    brief: 'Echipa avea nevoie de un film de recrutare care să arate oamenii reali din spatele produsului — fără imagini de stoc, fără clișee corporate — gata pentru o lansare peste trei săptămâni.',
    approach: `## Interviurile, coloana vertebrală
Am intervievat cinci ingineri în fața camerei, apoi am construit filmul în jurul propriilor lor cuvinte.

## O zi, două rezultate
În timp ce echipa video filma, fotograful nostru a realizat noi portrete de echipă și fotografii lifestyle din birou pentru pagina de cariere — inclusiv pe terasa cu vedere spre nordul Bucureștiului.`,
    result: 'Filmul principal și cinci variante 9:16 au rulat ca reclame pe LinkedIn și Instagram. În trimestrul următor, compania a ocupat 20 de posturi de inginer.',
    deliverables: ['Film principal de 90 s', '5 variante verticale', '60 de fotografii de echipă'], tags: ['recrutare', 'start-up', 'linkedin', 'Pipera'],
  },
  {
    key: 'p4', slug: 'fotograf-conferinta-romexpo', title: 'TechSummit 2026 la Romexpo — 1.200 de participanți, livrare în aceeași zi', service: 'event-photo', location: 'bucharest', venue: 'Romexpo, București', clientType: 'Conferință', date: '2026-05-12', featured: false, testimonial: 't4',
    excerpt: 'Acoperirea unei conferințe de două zile la Romexpo, cu selecții live pentru echipa de social media și un studio de portrete pentru speakeri.',
    brief: 'Organizatorii aveau nevoie de fotografii în timp real pentru social media, portrete de calitate ale speakerilor și o galerie completă pentru sponsori în trei zile.',
    approach: `## Un flux live
Al doilea fotograf a editat la fața locului; selecțiile ajungeau în folderul partajat al clientului în 30 de minute de la fiecare keynote.

## Studio pentru speakeri
Un studio pop-up în culise a oferit fiecărui speaker un portret unitar pentru recapitularea de după eveniment.`,
    result: '1.100 de fotografii editate, 45 de portrete ale speakerilor și peste 200 de imagini postate chiar în timpul evenimentului.',
    deliverables: ['1.100 de fotografii editate', '45 de portrete ale speakerilor', 'Selecții live'], tags: ['conferință', 'live', 'Romexpo'],
  },
  {
    key: 'p5', slug: 'nunta-pe-ploaie-centrul-vechi-bucuresti', title: 'Ioana & Alex — O nuntă pe ploaie în Centrul Vechi din București', service: 'wedding-photo', location: 'bucharest', venue: 'Centrul Vechi, București', clientType: 'Cuplu', date: '2025-10-11', featured: true, testimonial: 't5',
    excerpt: 'Când prognoza anunța ploaie 100%, am mizat pe ea: umbrele, reflexii și portrete pline de atmosferă în pasajele din Centrul Vechi.',
    brief: 'O nuntă restrânsă, cu 60 de invitați, într-un restaurant din Centrul Vechi. Mirii erau îngrijorați de prognoză și își doreau un plan de rezervă care să rămână special.',
    approach: `## Planul B a fost cel mai bun plan
Cu o zi înainte am verificat Pasajul Macca-Villacrosse și curtea Mănăstirii Stavropoleos, am luat umbrele transparente și am folosit pavajul ud pentru reflexii.`,
    result: 'Unele dintre cele mai frumoase portrete ale noastre de până acum. Mirii spun că ploaia a devenit partea lor preferată din poveste.',
    deliverables: ['520 de fotografii editate', 'Preview în 48h'], tags: ['ploaie', 'nuntă restrânsă', 'Centrul Vechi'],
  },
  {
    key: 'p6', slug: 'fotografie-produs-ceramica-bucuresti', title: 'Ceramică lucrată manual — ședință de catalog și lifestyle', service: 'product-photo', location: 'bucharest', venue: 'Studioul Lumenza, București', clientType: 'Brand e-commerce', date: '2026-02-08', featured: false, testimonial: 't6',
    excerpt: '40 de produse pe fundal alb plus scene lifestyle stilizate pentru un brand independent de ceramică din București.',
    brief: 'Un brand de ceramică din București, aflat în creștere, avea nevoie de packshot-uri unitare pentru noul magazin online și pentru listarea pe eMAG, plus imagini lifestyle pentru Instagram.',
    approach: `## Tethered și cu culori calibrate
Fiecare glazură a fost comparată cu piesa reală pe un monitor calibrat înainte să trecem mai departe.`,
    result: 'Magazinul a fost relansat cu noile imagini, iar rata de conversie a crescut vizibil încă din prima lună.',
    deliverables: ['120 de packshot-uri', '15 imagini lifestyle'], tags: ['e-commerce', 'ceramică'],
  },
  {
    key: 'p7', slug: 'film-nunta-palatul-stirbey-buftea', title: 'Diana & Paul — Film de nuntă la Palatul Știrbey, Buftea', service: 'wedding-film', location: 'ilfov', venue: 'Palatul Știrbey, Buftea', clientType: 'Cuplu', date: '2025-08-23', featured: false, testimonial: 't7',
    excerpt: 'Un film de vară cald la Palatul Știrbey, pe malul lacului Buftea, cu ceremonie în grădină și un final cu artificii.',
    brief: 'Diana și Paul își doreau un film vesel și alert, care să surprindă energia petrecerii lor cu 200 de invitați.',
    approach: `## Energie în montaj
Am filmat cu frame rate ridicat pe ringul de dans și am montat filmul pe înregistrarea live a formației.`,
    result: 'Un film highlight de 6 minute și un montaj complet al discursurilor, trimis de miri familiei din patru țări.',
    deliverables: ['Film highlight de 6 min', 'Montaj discursuri'], tags: ['palat', 'petrecere', 'vară', 'Buftea'],
  },
  {
    key: 'p8', slug: 'reels-pensiune-corbeanca', title: 'Pensiune boutique — camere, mâncare și Reels într-o singură zi', service: 'brand-video', location: 'corbeanca', venue: 'Corbeanca, Ilfov', clientType: 'Ospitalitate', date: '2026-03-15', featured: false, testimonial: null,
    excerpt: 'Fotografii și conținut video scurt pentru relansarea unei pensiuni boutique din Corbeanca, la 30 de minute de București.',
    brief: 'O pensiune cu 12 camere, foarte căutată de familiile din București în weekend, se relansa după renovare și avea nevoie de fotografii pentru platformele de rezervări, plus Reels pentru o lună întreagă.',
    approach: `## Lista de cadre, pe platforme
Am planificat fiecare cadru în funcție de destinație — Booking.com, imaginea principală de pe site, grila de Instagram, Reels — ca nimic să nu se irosească.`,
    result: 'Rezervările directe au crescut, iar seria de Reels a devenit cel mai performant conținut al pensiunii de până acum.',
    deliverables: ['80 de fotografii', '12 Reels', 'Video principal pentru site'], tags: ['ospitalitate', 'reels', 'Corbeanca'],
  },
] as const

export const posts = [
  {
    key: 'b1',
    slug: 'cat-costa-fotograf-nunta-bucuresti',
    title: 'Cât costă un fotograf de nuntă în București? (prețuri 2026)',
    category: 'pricing',
    publishedAt: '2026-09-02',
    services: ['wedding-photo'],
    location: 'bucharest',
    excerpt: 'Intervale reale de preț pentru un fotograf de nuntă în București și Ilfov în 2026, ce influențează costul și cum să comparați corect ofertele.',
    content: `Prețurile pentru un fotograf de nuntă în București variază mult — de la 500 € la peste 3.500 € — și nu este întotdeauna clar de ce. Iată o analiză sinceră, de la un studio din București care trimite oferte pentru zeci de nunți în fiecare lună.

## Intervale de preț obișnuite în București în 2026
- **500–900 €:** un fotograf, 4–6 ore, adesea la început de drum în fotografia de nuntă
- **1.000–2.000 €:** fotograf cu experiență sau echipă de doi, zi completă, galerie online
- **2.000–3.500 €+:** studiouri consacrate, doi fotografi, albume, ședințe de logodnă

## Ce influențează de fapt prețul
Numărul de ore și numărul de fotografi sunt factorii cei mai importanți. În București, ziua nunții e de obicei lungă: pregătiri în două sectoare diferite, cununia religioasă într-o biserică din oraș, apoi petrecerea într-o locație din Ilfov. Urmează timpul de editare — o nuntă completă înseamnă de obicei 40–60 de ore de muncă după eveniment — plus albumele și sezonul.

## Taxa de deplasare în București și Ilfov
Întrebați dacă deplasarea este inclusă. Mulți fotografi cer bani în plus pentru locațiile din Snagov, Corbeanca sau Mogoșoaia. Noi acoperim tot Bucureștiul și tot Ilfovul fără taxă de deplasare.

## Cum să comparați corect ofertele
Cereți fiecărui fotograf o **galerie completă de nuntă**, nu doar cele mai bune cadre. Verificați câte fotografii editate primiți, în cât timp le primiți și dacă echipamentul de rezervă și contractul sunt incluse.

## Prețurile noastre
Pachetele noastre de fotografie de nuntă pornesc de la 1.200 €. Vă puteți face propria estimare în mai puțin de un minut cu calculatorul nostru de ofertă.`,
    faqs: [
      { question: 'Merită un al doilea fotograf la o nuntă în București?', answer: 'Pentru nunți cu peste 80 de invitați sau cu pregătiri în zone diferite ale orașului, da — aveți ambele perspective ale fiecărui moment și mult mai multe fotografii spontane cu invitații.' },
    ],
  },
  {
    key: 'b2',
    slug: 'cat-costa-videograf-nunta-bucuresti',
    title: 'Cât costă un videograf de nuntă în București și Ilfov?',
    category: 'pricing',
    publishedAt: '2026-08-18',
    services: ['wedding-film'],
    location: null,
    excerpt: 'Prețurile pentru filmare nuntă în București și Ilfov în 2026, ce include fiecare nivel și ce întrebări să puneți înainte să rezervați.',
    content: `Un film de nuntă este singurul mod în care vă puteți auzi din nou jurămintele. Dar în București prețurile variază de la 600 € la 5.000 €. Iată ce primiți la fiecare nivel.

## Intervale de preț
- **600–1.200 €:** un videograf, doar film highlight
- **1.500–2.500 €:** doi videografi, film highlight plus ceremonia și discursurile
- **3.000 €+:** film de lungime documentară, dronă, mai multe montaje

## Sunetul e totul
Întrebați cum sunt înregistrate jurămintele și discursurile. Fără microfoane wireless pe miri și pe oficiant, cele mai emoționante momente se pierd adesea — mai ales în saloanele mari din jurul Bucureștiului.

## Drona: oraș vs. Ilfov
Centrul Bucureștiului și zona aeroportului Otopeni sunt spații aeriene restricționate. Dacă vă doriți cadre aeriene, o locație la Snagov, Corbeanca sau Mogoșoaia vă oferă mult mai multă libertate. Întrebați videograful cine se ocupă de avize.

## Licențierea muzicii
Filmele cu muzică nelicențiată ajung fără sonor pe Instagram și YouTube. Asigurați-vă că videograful vostru folosește o bibliotecă muzicală licențiată.`,
    faqs: [],
  },
  {
    key: 'b3',
    slug: 'locatii-nunta-ilfov-locuri-poze-bucuresti',
    title: 'Cele mai frumoase locații de nuntă din Ilfov și locuri pentru poze în București',
    category: 'venues',
    publishedAt: '2026-07-10',
    services: ['wedding-photo'],
    location: 'ilfov',
    excerpt: 'Locurile noastre preferate pentru nunți în jurul Bucureștiului — palate, lacuri și păduri din Ilfov — plus cele mai bune locuri din oraș pentru portrete și ședințe de logodnă.',
    content: `După sute de nunți în București și împrejurimi, acestea sunt locurile la care revenim mereu.

## Palate și mănăstiri din Ilfov
- **Palatul Mogoșoaia** — arhitectură brâncovenească, grădini și lac; pentru fotografie se percepe o taxă de acces
- **Palatul Știrbey, Buftea** — un parc romantic pe malul lacului Buftea
- **Mănăstirea Cernica** — insule cu mănăstire pe un lac la est de oraș
- **Mănăstirea Căldărușani** — un cadru liniștit, pe malul lacului, pentru cununia religioasă

## Lacuri și păduri
- **Lacul Snagov** — pontoane, intrări cu barca și apusuri deasupra apei
- **Corbeanca** — grădini de evenimente și marginea pădurii, pentru nunți restrânse

## Locuri pentru poze în București
- **Parcul Regele Mihai I (Herăstrău)** — cel mai bine dimineața devreme, înainte de aglomerație
- **Ateneul Român** — elegant și central
- **Parcul Cișmigiu** — poduri și copaci bătrâni, superb toamna
- **Centrul Vechi** — Pasajul Macca-Villacrosse vă salvează în zilele ploioase

## Sfaturi
Verificați mereu regulile privind autorizațiile, planificați în funcție de ora de aur, țineți cont de traficul de sâmbătă dintre București și Ilfov și aveți un plan pentru ploaie. Ajutăm fiecare cuplu să aleagă locațiile potrivite pentru programul zilei.`,
    faqs: [
      { question: 'Avem nevoie de autorizație pentru fotografii de nuntă la Palatul Mogoșoaia?', answer: 'De obicei se percepe o taxă de acces pentru fotografie și filmare profesională. Verificăm regulile în vigoare și ne ocupăm de ea din timp pentru cuplurile noastre.' },
    ],
  },
  {
    key: 'b4',
    slug: 'brief-video-prezentare-firma-bucuresti',
    title: 'Cum să scrieți brief-ul pentru un video de prezentare a firmei în București',
    category: 'guides',
    publishedAt: '2026-06-01',
    services: ['brand-video'],
    location: null,
    excerpt: 'Un model simplu de brief pe o singură pagină pentru echipele de marketing din București care comandă pentru prima dată un video de prezentare firmă sau de brand.',
    content: `Diferența dintre un video care performează și unul care rămâne nefolosit ține de obicei de brief, nu de cameră.

## Brief-ul pe o pagină
- **Obiectiv:** ce ar trebui să facă cei care urmăresc video-ul?
- **Public:** cine anume îl urmărește și unde?
- **Mesaj:** o singură propoziție pe care privitorul trebuie să o rețină
- **Formate:** 16:9, 9:16, 1:1 — și durata pentru fiecare
- **Termen limită și buget**

## Locații și logistică în București
Filmarea într-o clădire de birouri din Pipera sau din centru are adesea nevoie de acordul administrației clădirii, iar filmarea în spații publice poate necesita o autorizație de la primărie. Treceți-le din timp în brief — pot dura una-două săptămâni.

## Planificați întâi variantele scurte
Cele mai multe vizualizări vin de pe telefon. Stabiliți montajele verticale înainte de filmare, ca să putem încadra pentru ele.`,
    faqs: [],
  },
  {
    key: 'b5',
    slug: 'checklist-fotografie-produs-magazin-online',
    title: 'Checklist de fotografie de produs pentru magazinele online din București',
    category: 'guides',
    publishedAt: '2026-05-12',
    services: ['product-photo'],
    location: null,
    excerpt: 'Tot ce trebuie pregătit înainte de o ședință de fotografie produs în București, ca imaginile să respecte regulile marketplace-urilor și să vândă.',
    content: `Fotografiile de produs bune se planifică înainte ca cineva să pună mâna pe cameră.

## Înainte de ședință
- Mostre curate, fără etichete, pentru fiecare variantă
- O listă cu unghiurile și încadrările de care are nevoie fiecare platformă
- Referințe pentru culorile brandului, pentru o redare fidelă
- Un plan de livrare: aduceți produsele la studio sau trimiteți-le prin curier în București

## Regulile marketplace-urilor
eMAG și Amazon cer un fundal alb pur (RGB 255,255,255) pentru imaginea principală, iar produsul trebuie să ocupe în jur de 85% din cadru.

## Imagini lifestyle
Arătați dimensiunea și modul de folosire. O singură fotografie lifestyle bună răspunde adesea la întrebări care altfel s-ar termina cu retururi.`,
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
    { service: 'christening', baseFee: 150, hourlyRate: 100, minHours: 2, maxHours: 10 },
  ],
  addOns: [
    { name: 'Al doilea fotograf', price: 50, unit: 'perHour', services: ['wedding-photo', 'event-photo'] },
    { name: 'Al doilea videograf', price: 60, unit: 'perHour', services: ['wedding-film', 'brand-video'] },
    { name: 'Filmare cu drona (locații din Ilfov, avize incluse)', price: 250, unit: 'flat', services: ['wedding-film', 'brand-video'] },
    { name: 'Ședință de logodnă în București', price: 250, unit: 'flat', services: ['wedding-photo'] },
    { name: 'Album fine-art 30×30', price: 450, unit: 'flat', services: ['wedding-photo'] },
    { name: 'Teaser vertical (9:16)', price: 150, unit: 'flat', services: ['wedding-film'] },
    { name: 'Selecție în aceeași zi', price: 150, unit: 'flat', services: ['event-photo'] },
    { name: 'Variante extra pentru social media (×5)', price: 300, unit: 'flat', services: ['brand-video'] },
    { name: 'Styling lifestyle și recuzită', price: 200, unit: 'flat', services: ['product-photo'] },
  ],
} as const
