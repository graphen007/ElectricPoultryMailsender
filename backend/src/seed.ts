/**
 * Seed script — populates the database with Danish live music venues/festivals
 * and creates default email templates.
 * Run: npx ts-node src/seed.ts
 * Safe to re-run — skips existing entries by name+email / template name+language.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Venue from './models/Venue';
import Template from './models/Template';
import { getDanishEmailHtml, getDanishEmailText, getEnglishEmailHtml, getEnglishEmailText } from './templates/emailTemplates';

// Must be set before any network call
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
dotenv.config();

const venues = [
  // ─── AARHUS ──────────────────────────────────────────────────────
  {
    name: 'Voxhall',
    contactPerson: '',
    email: 'fondenvoxhall@fondenvoxhall.dk',
    phone: '+45 87 30 97 97',
    city: 'Aarhus',
    website: 'https://voxhall.dk',
    notes: 'Major Aarhus concert venue. Also manages Atlas. Capacity ~1200.',
    preferredLanguage: 'da',
  },
  {
    name: 'Atlas',
    contactPerson: '',
    email: 'fondenvoxhall@fondenvoxhall.dk',
    phone: '+45 87 30 97 97',
    city: 'Aarhus',
    website: 'https://voxhall.dk',
    notes: 'Smaller sibling venue to Voxhall. Same booking team. Capacity ~400.',
    preferredLanguage: 'da',
  },
  {
    name: 'Train',
    contactPerson: '',
    email: 'train@train.dk',
    phone: '+45 86 13 47 22',
    city: 'Aarhus',
    website: 'https://train.dk',
    notes: 'Classic Aarhus rock club. Toldbodgade 6C, 8000 Aarhus C.',
    preferredLanguage: 'da',
  },
  {
    name: 'Radar',
    contactPerson: '',
    email: 'info@radarlive.dk',
    city: 'Aarhus',
    website: 'https://radarlive.dk',
    notes: 'Alternative/underground music venue in Aarhus. Karen Wegeners Gade 6.',
    preferredLanguage: 'da',
  },
  {
    name: 'Turbinen / Vaerket',
    contactPerson: 'Michael Gonzalez',
    email: 'info@turbinen.dk',
    city: 'Aarhus',
    website: 'https://turbinen.dk',
    notes: 'We have played here before — Michael Gonzalez was very positive. Good contact.',
    preferredLanguage: 'da',
  },
  {
    name: 'Musikhuset Aarhus',
    contactPerson: 'Hans Helleshoj Buch',
    email: 'hbuch@aarhus.dk',
    phone: '+45 29 20 82 94',
    city: 'Aarhus',
    website: 'https://musikhusetaarhus.dk',
    notes: 'Booker for rytmisk musik. Large concert house. More formal process.',
    preferredLanguage: 'da',
  },
  {
    name: 'Folkclub Aarhus',
    contactPerson: '',
    email: 'info@folkclub.dk',
    city: 'Aarhus',
    website: 'https://folkclub.dk',
    notes: 'Folkclub Aarhus — open to various genres beyond folk.',
    preferredLanguage: 'da',
  },
  {
    name: 'Tokio Bar',
    contactPerson: '',
    email: 'contact@tokiobar.com',
    phone: '+45 31 89 41 64',
    city: 'Aarhus',
    website: 'https://tokiobar.com',
    notes: 'Rock\'n\'roll bar in Aarhus city centre. Skolegade 23. Hosts live acts — very relevant for us.',
    preferredLanguage: 'da',
  },
  {
    name: 'HeadQuarters (HQ)',
    contactPerson: '',
    email: 'booking@hq.dk',
    city: 'Aarhus',
    website: 'https://hq.dk',
    notes: 'Intimate club at Valdemarsgade 1 with frequent live gigs. Indie, rock, punk, metal, funk. Great fit.',
    preferredLanguage: 'da',
  },
  {
    name: 'Café Von Hatten',
    contactPerson: '',
    email: 'info@vonhatten.dk',
    phone: '+45 42 91 15 31',
    city: 'Randers',
    website: 'https://vonhatten.dk',
    notes: 'Music association bar in Randers — we won the audience prize here (Von Hatten-prisen 2025). Strong relationship.',
    preferredLanguage: 'da',
  },
  {
    name: 'Café Smagløs',
    contactPerson: '',
    email: 'info@smagloes.dk',
    city: 'Aarhus',
    website: 'https://smagloes.dk',
    notes: 'Bar at Klostertorvet 7. Open jam sessions Thursdays, frequent live music. Good for emerging acts.',
    preferredLanguage: 'da',
  },
  // ─── COPENHAGEN ──────────────────────────────────────────────────
  {
    name: 'VEGA (Lille VEGA)',
    contactPerson: '',
    email: 'info@vega.dk',
    phone: '+45 33 25 70 11',
    city: 'Copenhagen',
    website: 'https://vega.dk',
    notes: 'One of Denmark\'s best known venues. Enghavevej 40. Multiple stages — target Lille VEGA.',
    preferredLanguage: 'en',
  },
  {
    name: 'Amager Bio',
    contactPerson: '',
    email: 'info@amagerbio.dk',
    city: 'Copenhagen',
    website: 'https://amagerbio.dk',
    notes: 'Well-known for rock/metal bookings. Oresundsvej 6, Copenhagen S.',
    preferredLanguage: 'en',
  },
  {
    name: 'Rust / Rust In Peace',
    contactPerson: '',
    email: 'booking@rustinpeace.dk',
    city: 'Copenhagen',
    website: 'https://rustinpeace.dk',
    notes: 'Underground rock, metal, goth. Guldbergsgade 8, 2200 Kobenhavn N. ~220 capacity.',
    preferredLanguage: 'en',
  },
  {
    name: 'Loppen (Christiania)',
    contactPerson: '',
    email: 'booking@loppen.dk',
    city: 'Copenhagen',
    website: 'https://loppen.dk',
    notes: 'Legendary underground venue in Christiania. Strong rock/alternative history.',
    preferredLanguage: 'en',
  },
  {
    name: 'Pumpehuset',
    contactPerson: 'Katrine',
    email: 'katrine@pumpehuset.dk',
    city: 'Copenhagen',
    website: 'https://pumpehuset.dk',
    notes: 'Mid-size rock venue in Copenhagen. Studiestrade 52.',
    preferredLanguage: 'en',
  },
  {
    name: 'Stengade',
    contactPerson: '',
    email: 'booking@stengade.dk',
    city: 'Copenhagen',
    website: 'https://stengade.dk',
    notes: 'DIY/underground rock and punk venue in Norrebro.',
    preferredLanguage: 'en',
  },
  {
    name: 'Beta',
    contactPerson: '',
    email: 'info@beta2300.dk',
    city: 'Copenhagen',
    website: 'https://beta2300.dk',
    notes: 'Rock/metal tilt. Norrebro, Copenhagen.',
    preferredLanguage: 'en',
  },
  {
    name: 'Huset i Magstraede',
    contactPerson: '',
    email: 'huset@kff.kk.dk',
    city: 'Copenhagen',
    website: 'https://huset-kbh.dk',
    notes: 'Cultural house with live music programme. Magstraede 14, 1204 Kobenhavn K.',
    preferredLanguage: 'da',
  },
  {
    name: 'KB18',
    contactPerson: '',
    email: 'info@kb18.dk',
    city: 'Copenhagen',
    website: 'https://kb18.dk',
    notes: 'Small intimate venue in Copenhagen. Good for up-and-coming acts.',
    preferredLanguage: 'da',
  },
  {
    name: 'Hard Rock Cafe Copenhagen',
    contactPerson: '',
    email: 'copenhagen_social@hardrock.com',
    city: 'Copenhagen',
    website: 'https://www.hardrock.com/cafes/copenhagen',
    notes: 'Sometimes hosts live events. Radhuspladsen 45/47, 1550 Kobenhavn V.',
    preferredLanguage: 'en',
  },
  {
    name: 'Drop Inn',
    contactPerson: '',
    email: 'bookingdropinn@gmail.com',
    phone: '+45 33 11 24 04',
    city: 'Copenhagen',
    website: 'https://drop-inn.dk',
    notes: 'Classic intimate bar/café. Rock, blues, singer-songwriter. Kompagnistræde 34. Also: info@drop-inn.dk',
    preferredLanguage: 'da',
  },
  {
    name: 'Mojo Blues Bar',
    contactPerson: '',
    email: 'info@mojo.dk',
    city: 'Copenhagen',
    website: 'https://mojo.dk',
    notes: 'Intimate blues/rock venue. Løngangstræde 21C, Copenhagen K.',
    preferredLanguage: 'da',
  },
  {
    name: 'Zeppelin Rock Bar',
    contactPerson: '',
    email: 'zeppelin@zeppelinbar.dk',
    city: 'Copenhagen',
    website: 'https://www.facebook.com/zeppelinrockbar',
    notes: 'Classic rock & heavy metal bar on Vesterbrogade 45. Check Facebook for live music booking.',
    preferredLanguage: 'da',
  },
  // ─── ODENSE ──────────────────────────────────────────────────────
  {
    name: 'Posten (Musikhuset Posten)',
    contactPerson: '',
    email: 'booking@postenlive.dk',
    city: 'Odense',
    website: 'https://postenlive.dk',
    notes: 'Major live music venue in Odense.',
    preferredLanguage: 'da',
  },
  // ─── KOLDING ─────────────────────────────────────────────────────
  {
    name: 'Godset',
    contactPerson: '',
    email: 'godset@kolding.dk',
    city: 'Kolding',
    website: 'https://godset.dk',
    notes: 'Live music venue in Kolding.',
    preferredLanguage: 'da',
  },
  // ─── ROSKILDE ────────────────────────────────────────────────────
  {
    name: 'Gimle',
    contactPerson: '',
    email: 'booking@gimle.dk',
    city: 'Roskilde',
    website: 'https://gimle.dk',
    notes: 'Rock/alternative venue in Roskilde.',
    preferredLanguage: 'da',
  },
  // ─── SILKEBORG ───────────────────────────────────────────────────
  {
    name: 'Kedelhuset',
    contactPerson: '',
    email: 'info@kedelhuset.dk',
    city: 'Silkeborg',
    website: 'https://kedelhuset.dk',
    notes: 'Live music venue in Silkeborg. Mix of local and international acts including rock.',
    preferredLanguage: 'da',
  },
  // ─── HORSENS ─────────────────────────────────────────────────────
  {
    name: 'Horsens Ny Teater',
    contactPerson: '',
    email: 'info@horsens-ny-teater.dk',
    city: 'Horsens',
    website: 'https://horsens-ny-teater.dk',
    notes: 'Concert/event venue in Horsens.',
    preferredLanguage: 'da',
  },
  // ─── VEJLE ───────────────────────────────────────────────────────
  {
    name: 'Vejle Musikteater',
    contactPerson: '',
    email: 'info@vejle-musikteater.dk',
    city: 'Vejle',
    website: 'https://vejle-musikteater.dk',
    notes: 'Culture and concert house in Vejle.',
    preferredLanguage: 'da',
  },
  // ─── ESBJERG ─────────────────────────────────────────────────────
  {
    name: 'Tobakken',
    contactPerson: '',
    email: 'info@tobakken.dk',
    city: 'Esbjerg',
    website: 'https://tobakken.dk',
    notes: 'Cultural venue in Esbjerg.',
    preferredLanguage: 'da',
  },
  {
    name: 'Musikhuset Esbjerg',
    contactPerson: '',
    email: 'info@musikhuset.dk',
    city: 'Esbjerg',
    website: 'https://musikhuset.dk',
    notes: 'Concert house in Esbjerg.',
    preferredLanguage: 'da',
  },
  // ─── HELSINGOE ───────────────────────────────────────────────────
  {
    name: 'Kulturvaerftet',
    contactPerson: '',
    email: 'info@kulturvaerftet.dk',
    city: 'Helsingor',
    website: 'https://kulturvaerftet.dk',
    notes: 'Cultural venue in Helsingor.',
    preferredLanguage: 'da',
  },
  // ─── AALBORG ─────────────────────────────────────────────────────
  {
    name: 'Studenterhuset Aalborg',
    contactPerson: '',
    email: 'info@studenterhuset.dk',
    city: 'Aalborg',
    website: 'https://studenterhuset.dk',
    notes: 'Student culture venue in Aalborg — good target for rock acts.',
    preferredLanguage: 'da',
  },
  {
    name: 'Huset Aalborg',
    contactPerson: '',
    email: 'huset@huset-aalborg.dk',
    city: 'Aalborg',
    website: 'https://huset-aalborg.dk',
    notes: 'Cultural house with live music.',
    preferredLanguage: 'da',
  },
  // ─── FESTIVALS ───────────────────────────────────────────────────
  {
    name: 'Copenhell (Festival)',
    contactPerson: '',
    email: 'info@copenhell.dk',
    city: 'Copenhagen',
    website: 'https://copenhell.dk',
    notes: 'FESTIVAL. Denmark\'s biggest metal/hard rock festival. Very competitive — worth a shot. June.',
    preferredLanguage: 'en',
  },
  {
    name: 'NorthSide Festival',
    contactPerson: '',
    email: 'info@northside.dk',
    city: 'Aarhus',
    website: 'https://northside.dk',
    notes: 'FESTIVAL. Major Aarhus rock/indie festival. June.',
    preferredLanguage: 'da',
  },
  {
    name: 'Smukfest (Skanderborg)',
    contactPerson: '',
    email: 'info@smukfest.dk',
    city: 'Skanderborg',
    website: 'https://smukfest.dk',
    notes: 'FESTIVAL. Large forest festival near Aarhus. August. Various genres.',
    preferredLanguage: 'da',
  },
  {
    name: 'SPOT Festival',
    contactPerson: 'Albert Fajardo-Helmig',
    email: 'booking@spotfestival.dk',
    phone: '+45 71 74 71 22',
    city: 'Aarhus',
    website: 'https://spotfestival.dk',
    notes: 'FESTIVAL. Showcase festival for Nordic artists. May. Very relevant — focus on new Danish acts. Also: albert@spotfestival.dk',
    preferredLanguage: 'da',
  },
  {
    name: 'Tinderbox Festival',
    contactPerson: '',
    email: 'info@tinderbox.dk',
    city: 'Odense',
    website: 'https://tinderbox.dk',
    notes: 'FESTIVAL. Major rock festival in Odense. June.',
    preferredLanguage: 'da',
  },
  {
    name: 'Heartland Festival',
    contactPerson: '',
    email: 'info@heartlandfestival.dk',
    city: 'Funen',
    website: 'https://heartlandfestival.dk',
    notes: 'FESTIVAL. Cultural/music festival on Funen. May/June.',
    preferredLanguage: 'da',
  },
  {
    name: 'Jelling Musikfestival',
    contactPerson: 'Morten Faerk',
    email: 'productionmanager@jellingmusikfestival.dk',
    phone: '+45 22 36 65 50',
    city: 'Jelling',
    website: 'https://jellingmusikfestival.dk',
    notes: 'FESTIVAL. Traditional Danish music festival. Various genres. Also: info@jellingmusikfestival.dk',
    preferredLanguage: 'da',
  },
  {
    name: 'Roskilde Festival',
    contactPerson: '',
    email: 'info@roskilde-festival.dk',
    city: 'Roskilde',
    website: 'https://roskilde-festival.dk',
    notes: 'FESTIVAL. Denmark\'s largest festival. Very competitive but worth trying. Apply via their artist/band portal.',
    preferredLanguage: 'en',
  },
  {
    name: 'Nordic Noise Festival',
    contactPerson: '',
    email: 'info@nordicnoise.dk',
    city: 'Copenhagen',
    website: 'https://nordicnoise.dk',
    notes: 'FESTIVAL. Hard rock, sleaze rock, heavy metal festival — perfect fit for us. Usually May in Copenhagen area.',
    preferredLanguage: 'en',
  },
  {
    name: 'Viborg Metal Festival',
    contactPerson: '',
    email: 'booking@viborgmetalfestival.dk',
    city: 'Viborg',
    website: 'https://viborgmetalfestival.dk',
    notes: 'FESTIVAL. Metal/hard rock festival in Viborg, March annually. Also: info@viborgmetalfestival.dk',
    preferredLanguage: 'da',
  },
  {
    name: 'Heavy Agger Metal Festival',
    contactPerson: '',
    email: 'info@heavyagger.dk',
    city: 'Agger',
    website: 'https://heavyagger.dk',
    notes: 'FESTIVAL. Metal/hard rock festival at De Sorte Huse, Agger (Jutland). May. Small community-driven festival.',
    preferredLanguage: 'da',
  },
  {
    name: 'Ilter Festival',
    contactPerson: '',
    email: 'ilterbooking@gmail.com',
    city: 'Odense',
    website: 'https://ilterfestival.com',
    notes: 'FESTIVAL. Punk, hardcore, noisy rock, post-metal at Dynamo, Odense. May.',
    preferredLanguage: 'da',
  },
  {
    name: 'Aalborg Metal Festival',
    contactPerson: '',
    email: 'info@aalborgmetalfestival.dk',
    city: 'Aalborg',
    website: 'https://aalborgmetalfestival.dk',
    notes: 'FESTIVAL. Metal/rock festival in Aalborg, November. Run by Nordic Rock Booking.',
    preferredLanguage: 'da',
  },
];

// Default templates — use {{recipientName}} as placeholder
const PLACEHOLDER = '{{recipientName}}';
const defaultTemplates = [
  {
    name: 'Booking Henvendelse (Dansk)',
    language: 'da' as const,
    subject: 'Electric Poultry - Vi vil gerne spille for jer!',
    htmlBody: getDanishEmailHtml(PLACEHOLDER),
    textBody: getDanishEmailText(PLACEHOLDER),
    isDefault: true,
  },
  {
    name: 'Booking Inquiry (English)',
    language: 'en' as const,
    subject: 'Electric Poultry - We would love to play at your venue!',
    htmlBody: getEnglishEmailHtml(PLACEHOLDER),
    textBody: getEnglishEmailText(PLACEHOLDER),
    isDefault: true,
  },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected.\n');

  // Seed venues
  console.log('--- Seeding venues ---');
  let venuesAdded = 0, venuesSkipped = 0;
  for (const v of venues) {
    const existing = await Venue.findOne({ email: v.email, name: v.name });
    if (existing) {
      // Update website if it was added later
      if (v.website && !existing.website) {
        await Venue.findByIdAndUpdate(existing._id, { website: v.website });
        console.log(`  UPD   ${v.name} (added website)`);
      } else {
        console.log(`  SKIP  ${v.name}`);
      }
      venuesSkipped++;
    } else {
      await Venue.create(v);
      console.log(`  ADD   ${v.name} (${v.city})`);
      venuesAdded++;
    }
  }
  console.log(`Venues: ${venuesAdded} added, ${venuesSkipped} skipped.\n`);

  // Seed templates
  console.log('--- Seeding default templates ---');
  let tmplAdded = 0, tmplSkipped = 0;
  for (const t of defaultTemplates) {
    const existing = await Template.findOne({ name: t.name, language: t.language });
    if (existing) {
      console.log(`  SKIP  Template: ${t.name}`);
      tmplSkipped++;
    } else {
      await Template.create(t);
      console.log(`  ADD   Template: ${t.name}`);
      tmplAdded++;
    }
  }
  console.log(`Templates: ${tmplAdded} added, ${tmplSkipped} skipped.\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
