// Builds the inner pages (country guides, hub, privacy, 404), sitemap.xml and robots.txt.
// The home page (index.html) and company profile are written by hand.
// Run: node scripts/build-pages.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://maggloballink.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = new Date().toISOString().slice(0, 10);
const WA = '8618764701228';
const waLink = (text) => `https://wa.me/${WA}${text ? '?text=' + encodeURIComponent(text) : ''}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Icons (lucide, 1.5 stroke) ----------
const ic = (d, sw = 1.5) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  arrow: ic('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  chevron: ic('<path d="m6 9 6 6 6-6"/>'),
  search: ic('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
  clipboard: ic('<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>'),
  ship: ic('<path d="M12 10.19V14"/><path d="M12 2v3"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.19-3.64a2 2 0 0 0-1.62 0L3 14a11.6 11.6 0 0 0 2.81 7.76"/><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>'),
  boxes: ic('<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>'),
  message: ic('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
};
const WA_GLYPH = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.59-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.83 9.83 0 0 1 9.88 9.9c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>';

// ---------- Country data ----------
const CATS = {
  furniture: { img: 'furniture', name: 'Furniture and homeware', alt: 'Living room with a sofa, ottoman and wall art' },
  machinery: { img: 'machinery', name: 'Machinery', alt: 'Factory worker operating industrial machinery' },
  electronics: { img: 'electronics', name: 'Electronics and gadgets', alt: 'Blue headphones plugged into a smartphone' },
  clothing: { img: 'clothing', name: 'Clothing', alt: 'Colourful clothes on hangers on a shop rail' },
  hair: { img: 'hair', name: 'Premium-quality hair', alt: 'Woman with long, straight black hair' },
  beauty: { img: 'beauty', name: 'Beauty supplies', alt: 'Skincare and cosmetic bottles on a teal background' },
};

const supplierStep = { code: 'CN', title: 'Supplier in China', text: 'We find and verify the supplier, agree the price, approve samples with you, pay securely and inspect your order when it is ready.' };
const faq1688 = (name) => ({
  q: `Can you buy from 1688, Alibaba or Taobao for me and ship to ${name}?`,
  a: [`Yes. Send us the product link or a photo. We check the seller, pay them, inspect your goods and arrange shipping to ${name}.`, 'Many 1688 and Taobao sellers only deal with buyers inside China, so having someone on the ground makes this much easier.'],
});
const faqCheck = {
  q: 'Can you check a supplier before I pay?',
  a: ['Yes. Verifying the supplier is the first thing we do. We confirm the company is real, compare prices with other factories, and approve samples with you before you pay for the full order.'],
};
const faqConsolidate = (name) => ({
  q: 'Can you combine goods from different suppliers into one shipment?',
  a: [`Yes. We collect your orders from different suppliers, check them, and consolidate them into one shipment to ${name}. One freight booking and one clearance is usually cheaper and simpler than several small ones.`],
});

const COUNTRIES = [
  {
    slug: 'south-africa', name: 'South Africa', code: 'ZA',
    title: 'Import from China to South Africa | MAG Global Link',
    description: 'Sourcing agent in China for South African businesses. We find and check suppliers, inspect your goods and ship them to Durban, Johannesburg or Cape Town.',
    lead: 'MAG Global Link is your sourcing agent on the ground in China. We find and check suppliers, buy and inspect your goods, and ship them to your door in South Africa.',
    card: 'Via Durban, Cape Town or Gqeberha',
    facts: [['Main sea ports', 'Durban, Cape Town, Gqeberha'], ['Air freight', 'Johannesburg (O.R. Tambo), Cape Town'], ['Customs', 'SARS'], ['Currency', 'South African rand (ZAR)']],
    intro: [
      'Shops, salons, contractors and online sellers across South Africa buy stock from China all the time. The hard part is not finding a supplier on Alibaba or 1688. It is knowing whether that supplier is real, whether the bulk order will match the sample, and how to get the goods through the port without surprises.',
      'That is the work we do. We are on the ground in China, so we can speak to the factory, check samples and inspect your order before it ships. Then we coordinate sea or air freight to South Africa and keep you updated on WhatsApp until it reaches you.',
    ],
    journey: [
      supplierStep,
      { code: 'CN', title: 'Export from China', text: 'Your goods are packed, consolidated with your other purchases if needed, and booked on a ship or flight with full export documents.' },
      { code: 'ZA', title: 'Arrival in Durban or Johannesburg', text: 'Most sea freight lands at Durban, the busiest container port in the country. Cape Town and Gqeberha suit some routes. Air freight usually arrives at O.R. Tambo in Johannesburg.' },
      { code: 'ZA', title: 'Customs clearance with SARS', text: 'The goods are declared to SARS and duty and import VAT are paid before release. We supply the commercial invoice, packing list and bill of lading needed to declare them correctly.' },
      { code: 'ZA', title: 'Delivered to you', text: 'Your goods travel by road to your shop, warehouse or home, whether you are in Johannesburg, Pretoria, Cape Town, Durban, Gqeberha or a smaller town.' },
    ],
    products: {
      hair: 'Bundles, wigs, closures and frontals for salons and online hair businesses',
      furniture: 'Furniture for homes, guesthouses, Airbnb units and offices, from single pieces to full fit-outs',
      electronics: 'Phones, accessories, audio and smart devices. Check NRCS and ICASA rules before you order',
      clothing: 'Wholesale fashion, school and work uniforms for boutiques and resellers',
      beauty: 'Skincare, cosmetics, salon tools and packaging, including for your own brand',
      machinery: 'Construction, agricultural and production equipment, plus spare parts',
    },
    tips: [
      { title: 'Register with SARS if you import for business', text: 'Commercial importers normally need to be registered with SARS customs. A clearing agent can help with the registration and tell you what applies to your goods.' },
      { title: 'Check whether your product needs approval', text: 'Many electrical goods need an NRCS letter of authority, and devices with Wi-Fi, Bluetooth or a SIM usually need ICASA type approval before they can be sold. Ask us to request the supplier\'s test reports early.' },
      { title: 'Work out your full landed cost', text: 'The product price is only part of it. Add freight, insurance, customs duty, import VAT, clearing fees and local delivery to know your real cost per item before you set a selling price.' },
      { title: 'Choose sea or air by weight and urgency', text: 'Sea freight is the cheaper option for furniture, machinery and large orders. Air freight costs more per kilo but suits small, urgent or high-value items like hair and electronics.' },
    ],
    faqs: [
      faq1688('South Africa'),
      { q: 'How long does shipping from China to South Africa take?', a: ['It depends on sea or air, the port, and how quickly the goods clear customs. Sea freight to Durban usually takes several weeks door to door, while air freight is much faster. We give you the current options and times with your quote.'] },
      { q: 'Who pays customs duty and VAT in South Africa?', a: ['Duty and import VAT are paid to SARS when the goods are cleared, based on the type of product and its value. We prepare accurate invoices and packing lists so everything is declared correctly. Ask about door-to-door options when you request a quote.'] },
      faqCheck,
      faqConsolidate('South Africa'),
      { q: 'Do you deliver to Johannesburg and Cape Town?', a: ['We coordinate shipping to your door in South Africa, including Johannesburg, Pretoria, Cape Town, Durban and Gqeberha. Tell us your town when you ask for a quote.'] },
    ],
  },
  {
    slug: 'zimbabwe', name: 'Zimbabwe', code: 'ZW',
    title: 'Import from China to Zimbabwe | MAG Global Link',
    description: 'Sourcing agent in China for Zimbabwe. We verify suppliers, inspect your goods and coordinate shipping via Beira or Durban to Harare, Bulawayo and beyond.',
    lead: 'MAG Global Link is your sourcing agent on the ground in China. We find and check suppliers, buy and inspect your goods, and coordinate shipping to your door in Zimbabwe.',
    card: 'Via Beira or Durban, then by road',
    facts: [['Sea route', 'Beira or Durban, then by road'], ['Border posts', 'Forbes (Mutare), Beitbridge'], ['Air freight', 'Harare (Robert Gabriel Mugabe Intl)'], ['Customs', 'ZIMRA']],
    intro: [
      'Zimbabwe has no sea port, so goods from China land in Mozambique or South Africa first and finish the journey by truck. Every extra border is another place for delays or mistakes, so it pays to get the supplier and the paperwork right from the start.',
      'We handle the China side for you. We verify the supplier, check samples, inspect your order before it leaves and prepare clean documents for the trip through Beira or Durban. You get updates on WhatsApp all the way to Harare, Bulawayo or wherever you are.',
    ],
    journey: [
      supplierStep,
      { code: 'CN', title: 'Export from China', text: 'Goods are packed for a long road leg, consolidated if they come from several suppliers, and shipped with export documents.' },
      { code: 'MZ / ZA', title: 'Beira or Durban', text: 'Sea freight usually lands at Beira in Mozambique, the shorter route to eastern Zimbabwe, or at Durban in South Africa. From there it moves inland in transit.' },
      { code: 'ZW', title: 'Border and ZIMRA clearance', text: 'Goods enter at Forbes near Mutare on the Beira route, or Beitbridge on the Durban route, and are cleared with ZIMRA at the border or an inland port.' },
      { code: 'ZW', title: 'Delivered to you', text: 'Your goods continue by road to Harare, Bulawayo, Mutare, Gweru or your town. Air freight lands in Harare.' },
    ],
    products: {
      hair: 'Bundles, wigs, closures and frontals for salons and resellers',
      clothing: 'Wholesale clothing and school uniforms for shops and market traders',
      electronics: 'Phones, accessories, audio and smart devices',
      furniture: 'Furniture for homes, lodges, schools and offices, flat-packed where possible to save space',
      machinery: 'Agricultural, construction and production equipment, plus spare parts',
      beauty: 'Skincare, cosmetics, salon tools and packaging for shops and salons',
    },
    tips: [
      { title: 'Check whether your goods need a CBCA certificate', text: 'Some regulated products shipped to Zimbabwe need a Consignment Based Conformity Assessment (CBCA) certificate, issued after an inspection before the goods leave the exporting country. Tell us what you are buying and we will help you check before anything ships.' },
      { title: 'Plan for transit through a neighbour', text: 'Goods coming through Mozambique or South Africa travel in transit under bond. Accurate invoices and packing lists keep them moving at each border.' },
      { title: 'Work out your full landed cost', text: 'Add freight, transit costs, ZIMRA duty and VAT, clearing fees and the road trip inland to the product price before you set your selling price.' },
      { title: 'Combine small orders', text: 'Several small parcels each pay their own transport and clearing fees. Combining purchases into one consignment is usually cheaper and easier to clear.' },
    ],
    faqs: [
      faq1688('Zimbabwe'),
      { q: 'Which route is better for Zimbabwe, Beira or Durban?', a: ['Beira is closer to Mutare and Harare, while Durban has more sailings and connects through Beitbridge. The better route depends on where you are, what you are shipping and current costs, so we compare options when we quote.'] },
      { q: 'How long does shipping from China to Zimbabwe take?', a: ['Sea freight plus the road leg from Beira or Durban usually takes several weeks, depending on sailings and border clearance. Air freight to Harare is much faster for small, urgent items. We confirm current times with your quote.'] },
      { q: 'What is CBCA and does my order need it?', a: ['CBCA is Zimbabwe\'s Consignment Based Conformity Assessment programme for certain regulated products. If your goods fall under it, they must be inspected and certified before they ship. Ask us before you order and we will help you check.'] },
      faqCheck,
      { q: 'Do you deliver to Bulawayo and other towns?', a: ['We coordinate shipping to your door in Zimbabwe, including Harare, Bulawayo, Mutare and Gweru. Tell us your town when you ask for a quote.'] },
    ],
  },
  {
    slug: 'botswana', name: 'Botswana', code: 'BW',
    title: 'Import from China to Botswana | MAG Global Link',
    description: 'Sourcing agent in China for Botswana. We find and check suppliers, inspect your goods and coordinate shipping via Durban or Walvis Bay to Gaborone and beyond.',
    lead: 'MAG Global Link is your sourcing agent on the ground in China. We find and check suppliers, buy and inspect your goods, and coordinate shipping to your door in Botswana.',
    card: 'Via Durban or Walvis Bay, then by road',
    facts: [['Sea route', 'Durban or Walvis Bay, then by road'], ['Border posts', 'Tlokweng, Ramatlabama, Mamuno'], ['Air freight', 'Gaborone (Sir Seretse Khama Intl)'], ['Customs', 'BURS']],
    intro: [
      'Botswana is landlocked, so goods from China arrive by sea in South Africa or Namibia and then travel by road. Botswana is part of the Southern African Customs Union with South Africa, Namibia, Lesotho and Eswatini, which keeps the rules familiar, but each border still needs the right documents.',
      'We take care of the China side. We check the supplier, approve samples with you, inspect your goods before they leave and coordinate the shipment to Gaborone, Francistown, Maun or wherever your business is.',
    ],
    journey: [
      supplierStep,
      { code: 'CN', title: 'Export from China', text: 'Your goods are packed, consolidated with other purchases if needed, and booked by sea or air with export documents.' },
      { code: 'ZA / NA', title: 'Durban or Walvis Bay', text: 'Most sea freight for Botswana lands at Durban and travels north by road. Walvis Bay in Namibia is the other option, linked to Botswana by the Trans-Kalahari Corridor.' },
      { code: 'BW', title: 'Border and BURS clearance', text: 'The goods cross at a border post such as Tlokweng or Ramatlabama from South Africa, or Mamuno from Namibia, and are cleared with BURS.' },
      { code: 'BW', title: 'Delivered to you', text: 'Your goods continue to Gaborone, Francistown, Maun, Palapye or your town. Air freight usually lands in Gaborone or comes through Johannesburg.' },
    ],
    products: {
      furniture: 'Furniture and fittings for homes, guesthouses, safari lodges and offices',
      machinery: 'Agricultural, construction and production equipment, plus spare parts',
      hair: 'Bundles, wigs, closures and frontals for salons and online sellers',
      electronics: 'Phones, accessories, audio and smart devices for shops and resellers',
      clothing: 'Wholesale fashion, work wear and school uniforms',
      beauty: 'Skincare, cosmetics, salon tools and packaging',
    },
    tips: [
      { title: 'Check whether you need an import permit', text: 'Some goods need an import permit in Botswana before they arrive. Confirm with BURS or your clearing agent before you order so nothing is held at the border.' },
      { title: 'Pick the corridor that suits your town', text: 'Durban is the usual route for Gaborone and the south east. Walvis Bay and the Trans-Kalahari Corridor can make sense for Ghanzi and the west. We compare options with you.' },
      { title: 'Work out your full landed cost', text: 'Add freight, transit through South Africa or Namibia, customs duty, VAT, clearing fees and local delivery to the product price.' },
      { title: 'Combine small orders', text: 'Buying from several suppliers? We collect everything in China and send it as one shipment, which is usually cheaper and simpler at the border.' },
    ],
    faqs: [
      faq1688('Botswana'),
      { q: 'How do goods from China reach Botswana?', a: ['Usually by sea to Durban in South Africa, then by truck into Botswana. Some cargo goes through Walvis Bay in Namibia instead. Small, urgent items can go by air to Gaborone or through Johannesburg.'] },
      { q: 'How long does shipping from China to Botswana take?', a: ['Sea freight plus the road trip usually takes several weeks, depending on sailings and border clearance. Air freight is much faster for small, urgent items. We confirm current times with your quote.'] },
      { q: 'Does Botswana being in SACU help?', a: ['Yes. Botswana, South Africa, Namibia, Lesotho and Eswatini share a common external tariff, so goods moving through South Africa or Namibia follow familiar procedures. You still need correct documents at every border.'] },
      faqCheck,
      { q: 'Do you deliver to Francistown and Maun?', a: ['We coordinate shipping to your door in Botswana, including Gaborone, Francistown, Maun and Palapye. Tell us your town when you ask for a quote.'] },
    ],
  },
  {
    slug: 'namibia', name: 'Namibia', code: 'NA',
    title: 'Import from China to Namibia | MAG Global Link',
    description: 'Sourcing agent in China for Namibia. We verify suppliers, inspect your goods and coordinate shipping through Walvis Bay to Windhoek and the rest of Namibia.',
    lead: 'MAG Global Link is your sourcing agent on the ground in China. We find and check suppliers, buy and inspect your goods, and coordinate shipping to your door in Namibia.',
    card: 'Via Walvis Bay',
    facts: [['Main sea port', 'Walvis Bay'], ['Air freight', 'Windhoek (Hosea Kutako Intl)'], ['Customs', 'NamRA'], ['Currency', 'Namibian dollar, pegged to the rand']],
    intro: [
      'Namibia has its own deep-water port at Walvis Bay, so goods from China can come straight to the coast and reach Windhoek by road. The route itself is well run. The supplier side is where most problems start: the wrong specification, poor quality, or a seller who stops answering after payment.',
      'We work in China for you. We verify suppliers, approve samples, inspect your goods before they ship and keep you updated on WhatsApp until they reach Windhoek, Swakopmund, Oshakati or your town.',
    ],
    journey: [
      supplierStep,
      { code: 'CN', title: 'Export from China', text: 'Your goods are packed, consolidated with your other purchases if needed, and booked on a ship or flight with export documents.' },
      { code: 'NA', title: 'Walvis Bay', text: 'Sea freight arrives at Walvis Bay on the Atlantic coast, Namibia\'s main port. Some cargo also comes overland from Durban.' },
      { code: 'NA', title: 'Customs clearance with NamRA', text: 'The goods are declared to NamRA, and duty and VAT are paid before release. We supply the invoices and packing lists needed to declare them correctly.' },
      { code: 'NA', title: 'Delivered to you', text: 'Your goods travel by road to Windhoek, Swakopmund, Oshakati, Ondangwa, Rundu or your town. Air freight arrives at Hosea Kutako near Windhoek.' },
    ],
    products: {
      furniture: 'Furniture for homes, guesthouses, lodges and offices',
      machinery: 'Construction, agricultural and workshop equipment, plus spare parts',
      electronics: 'Phones, accessories, audio and smart devices',
      hair: 'Bundles, wigs, closures and frontals for salons and resellers',
      clothing: 'Wholesale fashion, school and work uniforms',
      beauty: 'Skincare, cosmetics, salon tools and packaging',
    },
    tips: [
      { title: 'Use Walvis Bay to your advantage', text: 'Shipping straight into Walvis Bay avoids crossing another country, which keeps the paperwork simple. Ask us to compare it with the Durban road route for your town.' },
      { title: 'Check product rules before you order', text: 'Some products, such as certain electrical goods, food or cosmetics, may need permits or standards approval. Confirm with NamRA or your clearing agent first.' },
      { title: 'Work out your full landed cost', text: 'Add freight, insurance, customs duty, VAT, port and clearing fees, and road transport from Walvis Bay to the product price.' },
      { title: 'Order samples from new suppliers', text: 'A sample costs little compared with a container of the wrong product. We approve samples with you before the bulk order is paid.' },
    ],
    faqs: [
      faq1688('Namibia'),
      { q: 'Do goods for Namibia come through Walvis Bay or Durban?', a: ['Most sea freight for Namibia goes straight to Walvis Bay. Durban followed by a long road trip is sometimes used, depending on sailings and where you are. We look at both when we quote.'] },
      { q: 'How long does shipping from China to Namibia take?', a: ['Sea freight to Walvis Bay usually takes several weeks, plus clearance and the road trip inland. Air freight to Windhoek is much faster for small, urgent items. We confirm current times with your quote.'] },
      { q: 'Who pays customs duty and VAT in Namibia?', a: ['Duty and VAT are paid to NamRA when your goods are cleared, based on the type of goods and their value. Namibia is part of SACU, so it shares a common external tariff with South Africa, Botswana, Lesotho and Eswatini.'] },
      faqCheck,
      { q: 'Do you deliver outside Windhoek?', a: ['Yes. We coordinate shipping to your door in Namibia, including Swakopmund, Walvis Bay, Oshakati and Rundu. Tell us your town when you ask for a quote.'] },
    ],
  },
  {
    slug: 'lesotho', name: 'Lesotho', code: 'LS',
    title: 'Import from China to Lesotho | MAG Global Link',
    description: 'Sourcing agent in China for Lesotho. We check suppliers, inspect your goods and coordinate shipping through Durban to Maseru, Maputsoe and the rest of Lesotho.',
    lead: 'MAG Global Link is your sourcing agent on the ground in China. We find and check suppliers, buy and inspect your goods, and coordinate shipping to your door in Lesotho.',
    card: 'Via Durban, then by road',
    facts: [['Sea route', 'Durban, then by road'], ['Border posts', 'Maseru Bridge, Ficksburg Bridge'], ['Air freight', 'Usually via Johannesburg'], ['Currency', 'Loti, pegged to the rand']],
    intro: [
      'Lesotho sits entirely inside South Africa, so goods from China land at Durban and travel by road to a border post such as Maseru Bridge or Ficksburg Bridge. As a SACU member, Lesotho shares customs rules with its neighbours, but your goods still need clean invoices and packing lists to cross without delay.',
      'We look after everything on the China side: finding and checking suppliers, approving samples, buying, inspecting and preparing the shipment. You get updates on WhatsApp until your goods reach Maseru, Maputsoe, Teyateyaneng or your town.',
    ],
    journey: [
      supplierStep,
      { code: 'CN', title: 'Export from China', text: 'Your goods are packed, consolidated with your other purchases if needed, and booked by sea or air with export documents.' },
      { code: 'ZA', title: 'Durban', text: 'Sea freight for Lesotho lands at Durban and moves inland by truck through KwaZulu-Natal and the Free State, in transit under bond.' },
      { code: 'LS', title: 'Border clearance', text: 'Goods enter Lesotho at Maseru Bridge, Ficksburg Bridge into Maputsoe, or another border post, and are cleared by Lesotho customs.' },
      { code: 'LS', title: 'Delivered to you', text: 'Your goods continue to Maseru, Maputsoe, Teyateyaneng, Mafeteng, Leribe or your town.' },
    ],
    products: {
      clothing: 'Wholesale fashion and school uniforms for shops and resellers',
      machinery: 'Construction, agricultural and production equipment, including sewing and garment machines',
      furniture: 'Furniture for homes, guesthouses, schools and offices',
      hair: 'Bundles, wigs, closures and frontals for salons and resellers',
      electronics: 'Phones, accessories, audio and smart devices',
      beauty: 'Skincare, cosmetics, salon tools and packaging',
    },
    tips: [
      { title: 'Plan the transit through South Africa', text: 'Goods for Lesotho cross South Africa under bond. Correct invoices and packing lists help them clear at the Lesotho border instead of waiting in Durban.' },
      { title: 'Work out your full landed cost', text: 'Add freight to Durban, the road trip to Lesotho, customs duty, VAT, clearing fees and local delivery to the product price.' },
      { title: 'Combine small orders', text: 'Several small parcels each pay their own transport and clearing fees. One consolidated shipment is usually cheaper and easier at the border.' },
      { title: 'Approve samples before bulk', text: 'For a new supplier, a sample is the cheapest way to avoid a big mistake. We approve samples with you before the bulk order is paid.' },
    ],
    faqs: [
      faq1688('Lesotho'),
      { q: 'How do goods from China get to Lesotho?', a: ['By sea to Durban, then by truck to a border post such as Maseru Bridge or Ficksburg Bridge. Small, urgent items can travel by air to Johannesburg and then by road.'] },
      { q: 'How long does shipping from China to Lesotho take?', a: ['Sea freight to Durban plus the road trip usually takes several weeks, depending on sailings and clearance. Air freight is much faster for small, urgent items. We confirm current times with your quote.'] },
      { q: 'Does Lesotho being in SACU matter?', a: ['Yes. Lesotho shares a common external tariff with South Africa, Botswana, Namibia and Eswatini, so goods travelling through South Africa follow familiar procedures. You still need correct documents at the border.'] },
      faqCheck,
      faqConsolidate('Lesotho'),
    ],
  },
];

// ---------- Shared partials ----------
function head({ title, description, path, jsonld, noindex = false, preloadHero = true }) {
  const url = SITE + path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  ${noindex ? '<meta name="robots" content="noindex, follow" />' : `<link rel="canonical" href="${url}" />\n  <meta name="robots" content="index, follow, max-image-preview:large" />`}
  <meta name="theme-color" content="#061F40" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="MAG Global Link" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${SITE}/assets/img/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${SITE}/assets/img/og-image.jpg" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png" />
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
${preloadHero ? '  <link rel="preload" as="image" href="/assets/img/w/hero-port-1920.webp" imagesrcset="/assets/img/w/hero-port-960.webp 960w, /assets/img/w/hero-port-1920.webp 1920w" imagesizes="100vw" fetchpriority="high" />\n' : ''}  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
${jsonld ? `  <script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n  </script>\n` : ''}</head>`;
}

function header(current) {
  const cur = (k) => (current === k ? ' aria-current="page"' : '');
  return `<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="header" id="header">
    <div class="container header__inner">
      <a href="/" class="brand" aria-label="MAG Global Link home">
        <img src="/assets/img/mark.png" alt="" width="60" height="42" />
        <span class="brand__word"><strong>MAG</strong><small>GLOBAL LINK</small></span>
      </a>
      <nav class="nav" id="nav" aria-label="Main">
        <a href="/#services">Services</a>
        <a href="/#sourcing">What we source</a>
        <a href="/import-from-china"${cur('countries')}>Countries</a>
        <a href="/#students">Study in China</a>
        <a href="/#contact">Contact</a>
        <a href="${waLink()}" class="btn btn--wa btn--sm" target="_blank" rel="noopener">Get a quote</a>
      </nav>
      <button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

const footer = () => `
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <a href="/" class="brand" aria-label="MAG Global Link home">
          <img src="/assets/img/mark.png" alt="" width="60" height="42" />
          <span class="brand__word"><strong>MAG</strong><small>GLOBAL LINK</small></span>
        </a>
        <p>Your trusted link to China for sourcing, procurement, shipping and education.</p>
      </div>
      <nav aria-label="Services">
        <p class="footer__h">Services</p>
        <ul>
          <li><a href="/#sourcing">Product sourcing</a></li>
          <li><a href="/#end-to-end">Procurement</a></li>
          <li><a href="/#end-to-end">Shipping coordination</a></li>
          <li><a href="/#students">University applications</a></li>
          <li><a href="/#students">Student support</a></li>
        </ul>
      </nav>
      <nav aria-label="Countries">
        <p class="footer__h">Import from China to</p>
        <ul>
${COUNTRIES.map((c) => `          <li><a href="/import-from-china/${c.slug}"><span class="code">${c.code}</span>${c.name}</a></li>`).join('\n')}
        </ul>
      </nav>
      <div>
        <p class="footer__h">Contact</p>
        <ul>
          <li><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp +86 187 6470 1228</a></li>
          <li><a href="mailto:maggloballink@gmail.com">maggloballink@gmail.com</a></li>
          <li><a href="/company-profile">Company profile</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© <span id="year">${new Date().getFullYear()}</span> MAG Global Link. All rights reserved.</span>
      <nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/sitemap.xml">Sitemap</a></nav>
    </div>
  </footer>

  <a href="${waLink()}" class="wa-float" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
    <svg viewBox="-1 -1 26 26" aria-hidden="true">
      <path fill="#25D366" stroke="#25D366" stroke-width="1.6" stroke-linejoin="round" d="M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      <path fill="#FFFFFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  </a>

  <script src="/script.js" defer></script>
  <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;

const heroMedia = `<div class="page-hero__media"><img src="/assets/img/w/hero-port-1920.webp" srcset="/assets/img/w/hero-port-960.webp 960w, /assets/img/w/hero-port-1920.webp 1920w" sizes="100vw" alt="" width="1920" height="1279" fetchpriority="high" /></div>`;

const crumbs = (items) => `<ol class="crumbs" aria-label="Breadcrumb">${items.map(([label, href]) => `<li>${href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}</li>`).join('')}</ol>`;
const crumbsLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + (href || items.at(-1)[2]) })),
});

const faqHtml = (faqs) => `<div class="faq">
${faqs.map((f) => `          <details>
            <summary>${esc(f.q)}${I.chevron}</summary>
            <div>${f.a.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          </details>`).join('\n')}
        </div>`;
const faqLd = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') } })),
});

const svcList = (name) => `<ul class="svc">
            <li>${I.search}<div><h3>Product and supplier sourcing</h3><p>We find, compare and verify suppliers so you get the right product at the right price.</p></div></li>
            <li>${I.clipboard}<div><h3>Procurement and quality checks</h3><p>We negotiate, pay suppliers securely, approve samples with you and inspect your order before it leaves.</p></div></li>
            <li>${I.boxes}<div><h3>Consolidation</h3><p>Buying from several suppliers? We collect everything in one place and ship it together.</p></div></li>
            <li>${I.ship}<div><h3>Shipping coordination to ${name}</h3><p>Sea or air freight, export documents and tracking, with updates on WhatsApp until your goods arrive.</p></div></li>
          </ul>`;

const ctaBand = (name, text) => `
    <section class="cta-band">
      <div class="container cta-band__inner">
        <div>
          <h2>Ready to import from China${name ? ' to ' + name : ''}?</h2>
          <p>Send us a photo, a link or a list. We'll come back with options and a quote.</p>
        </div>
        <div class="cta-band__actions">
          <a href="${waLink(text)}" class="btn btn--wa" target="_blank" rel="noopener">${WA_GLYPH}Chat on WhatsApp</a>
          <a href="mailto:maggloballink@gmail.com" class="btn btn--ghost-light">Email us</a>
        </div>
      </div>
    </section>`;

const orgRef = { '@id': SITE + '/#org' };
const orgLd = {
  '@type': 'Organization', '@id': SITE + '/#org', name: 'MAG Global Link', url: SITE + '/',
  logo: SITE + '/assets/img/logo.png', email: 'maggloballink@gmail.com', telephone: '+86 187 6470 1228',
};

// ---------- Country page ----------
function countryPage(c) {
  const path = `/import-from-china/${c.slug}`;
  const waText = `Hello MAG Global Link, I'm in ${c.name} and I'd like a quote to import from China.`;
  const bc = [['Home', '/'], ['Import from China', '/import-from-china'], [c.name, null, path]];
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      orgLd,
      {
        '@type': 'Service', '@id': SITE + path + '#service',
        name: `China sourcing and shipping to ${c.name}`,
        serviceType: 'Sourcing agent, procurement and shipping coordination',
        description: c.description, provider: orgRef, url: SITE + path,
        areaServed: { '@type': 'Country', name: c.name },
      },
      crumbsLd(bc),
      faqLd(c.faqs),
    ],
  };
  const others = COUNTRIES.filter((o) => o.slug !== c.slug);

  return `${head({ title: c.title, description: c.description, path, jsonld })}
${header('countries')}

  <main id="main">
    <section class="page-hero">
      ${heroMedia}
      <div class="container">
        ${crumbs(bc)}
        <p class="route-code">CN → ${c.code}</p>
        <h1>Import from China to ${c.name}</h1>
        <p class="lead">${esc(c.lead)}</p>
        <div class="hero__actions">
          <a href="${waLink(waText)}" class="btn btn--wa" target="_blank" rel="noopener">${WA_GLYPH}Get a quote on WhatsApp</a>
          <a href="#route" class="btn btn--ghost-light">How shipping works</a>
        </div>
        <dl class="facts">
${c.facts.map(([k, v]) => `          <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <h2 class="h2">A buying agent in China for ${c.name}</h2>
        <div>
          <div class="prose">
${c.intro.map((p) => `            <p>${esc(p)}</p>`).join('\n')}
          </div>
          ${svcList(c.name)}
        </div>
      </div>
    </section>

    <section class="section section--white" id="route">
      <div class="container split">
        <div>
          <h2 class="h2">How goods get from China to ${c.name}</h2>
          <p class="lead" style="margin-top:20px">The usual route, step by step. We confirm the best option for your order and town when we quote.</p>
        </div>
        <ol class="journey">
${c.journey.map((j) => `          <li><span class="code">${j.code}</span><div><h3>${esc(j.title)}</h3><p>${esc(j.text)}</p></div></li>`).join('\n')}
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2 class="h2">What buyers in ${c.name} source with us</h2>
          <p class="lead">The six categories we work in, and many more on request.</p>
        </div>
        <ul class="cats cats--rows">
${Object.entries(c.products).map(([k, text]) => `          <li class="cat"><img src="/assets/img/w/${CATS[k].img}.webp" alt="${esc(CATS[k].alt)}" width="600" height="600" loading="lazy" /><div><h3>${CATS[k].name}</h3><p>${esc(text)}</p></div></li>`).join('\n')}
        </ul>
        <p class="cats-more">Looking for something else, like solar equipment, building materials or vehicle parts? <a href="${waLink(`Hello MAG Global Link, I'm in ${c.name}. Can you source this product for me?`)}" target="_blank" rel="noopener">Send us a photo or a link</a> and we'll tell you what we can find.</p>
      </div>
    </section>

    <section class="section section--white">
      <div class="container">
        <div class="section-head">
          <h2 class="h2">Before you import into ${c.name}</h2>
          <p class="lead">A few things worth checking before you place an order. Rules change, so always confirm the details for your product.</p>
        </div>
        <ul class="tips">
${c.tips.map((t) => `          <li><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <h2 class="h2">Questions from ${c.name}</h2>
        ${faqHtml(c.faqs)}
      </div>
    </section>
${ctaBand(c.name, waText)}

    <section class="section section--white">
      <div class="container">
        <div class="section-head">
          <h2 class="h2">Importing to another country?</h2>
          <p class="lead">We also coordinate shipping from China to these countries.</p>
        </div>
        <div class="countries">
${others.map((o) => `          <a class="country" href="/import-from-china/${o.slug}"><span class="code">CN → ${o.code}</span><strong>${o.name}</strong><span>${esc(o.card)}</span></a>`).join('\n')}
          <a class="country" href="/import-from-china"><span class="code">All routes</span><strong>Southern Africa</strong><span>Every country we ship to</span></a>
        </div>
      </div>
    </section>
  </main>
${footer()}`;
}

// ---------- Hub page ----------
function hubPage() {
  const path = '/import-from-china';
  const title = 'Import from China to Southern Africa | MAG Global Link';
  const description = 'Sourcing agent in China for South Africa, Zimbabwe, Botswana, Namibia and Lesotho. Verified suppliers, quality checks and shipping coordinated to your door.';
  const bc = [['Home', '/'], ['Import from China', null, path]];
  const faqs = [
    faq1688('your country'),
    faqCheck,
    { q: 'How long does shipping from China take?', a: ['It depends on sea or air, the port of arrival and border clearance. Sea freight usually takes several weeks door to door, while air freight is much faster for small, urgent items. Each country guide explains the usual route, and we confirm current times with your quote.'] },
    faqConsolidate('your country'),
  ];
  const jsonld = { '@context': 'https://schema.org', '@graph': [orgLd, crumbsLd(bc), faqLd(faqs)] };
  return `${head({ title, description, path, jsonld })}
${header('countries')}

  <main id="main">
    <section class="page-hero">
      ${heroMedia}
      <div class="container">
        ${crumbs(bc)}
        <p class="route-code">CN → ZA · ZW · BW · NA · LS</p>
        <h1>Import from China to southern Africa</h1>
        <p class="lead">Pick your country to see how goods get there, what to check before you order, and how we help on the China side.</p>
        <div class="hero__actions">
          <a href="${waLink("Hello MAG Global Link, I'd like a quote to import from China.")}" class="btn btn--wa" target="_blank" rel="noopener">${WA_GLYPH}Get a quote on WhatsApp</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2 class="h2">Choose your country</h2>
          <p class="lead">Each guide covers the usual sea and air routes, customs, and the products buyers there source most.</p>
        </div>
        <div class="countries">
${COUNTRIES.map((o) => `          <a class="country" href="/import-from-china/${o.slug}"><span class="code">CN → ${o.code}</span><strong>${o.name}</strong><span>${esc(o.card)}</span></a>`).join('\n')}
          <a class="country" href="${waLink("Hello MAG Global Link, I'd like to import from China. Do you ship to my country?")}" target="_blank" rel="noopener"><span class="code">Other routes</span><strong>Somewhere else</strong><span>Ask us on WhatsApp</span></a>
        </div>
      </div>
    </section>

    <section class="section section--white">
      <div class="container split">
        <h2 class="h2">What we do on the China side</h2>
        <div>
          <div class="prose">
            <p>Buying from China is easy to start and easy to get wrong. Photos can be misleading, samples can differ from the bulk order, and suppliers you have never met can stop answering after payment.</p>
            <p>MAG Global Link works for you in China. We find and check suppliers, buy on your behalf, inspect your goods, and coordinate shipping to your country, with updates on WhatsApp the whole way.</p>
          </div>
          ${svcList('your country')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2 class="h2">How it works</h2>
          <p class="lead">No complicated forms. Message us and we take it from there.</p>
        </div>
        <ol class="steps">
          <li><span class="steps__n">01</span><h3>Tell us what you need</h3><p>Send product photos, links or a list on WhatsApp or email.</p></li>
          <li><span class="steps__n">02</span><h3>Get options and a quote</h3><p>We share verified suppliers, prices and samples.</p></li>
          <li><span class="steps__n">03</span><h3>We buy and inspect</h3><p>We purchase, check quality and prepare everything for shipping.</p></li>
          <li><span class="steps__n">04</span><h3>Delivered to you</h3><p>Your goods are shipped and tracked to your door, with updates all the way.</p></li>
        </ol>
      </div>
    </section>

    <section class="section section--white">
      <div class="container split">
        <h2 class="h2">Common questions</h2>
        ${faqHtml(faqs)}
      </div>
    </section>
${ctaBand('', "Hello MAG Global Link, I'd like a quote to import from China.")}
  </main>
${footer()}`;
}

// ---------- Privacy ----------
function privacyPage() {
  const path = '/privacy';
  return `${head({ title: 'Privacy | MAG Global Link', description: 'How MAG Global Link handles the information you share with us through this website, WhatsApp and email.', path, preloadHero: false })}
${header('')}

  <main id="main">
    <section class="page-hero page-hero--plain">
      <div class="container">
        ${crumbs([['Home', '/'], ['Privacy', null]])}
        <h1>Privacy</h1>
        <p class="lead">Last updated 13 November 2026</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="prose">
          <p>This page explains what information MAG Global Link collects through this website and how we use it. If you have any questions, email <a href="mailto:maggloballink@gmail.com">maggloballink@gmail.com</a>.</p>
          <h2>What this website collects</h2>
          <p>This website has no accounts and does not store the messages you write. The contact form only opens WhatsApp with your message filled in. When you send it, the message goes through WhatsApp, which is run by Meta under its own privacy policy.</p>
          <p>We use Vercel Web Analytics to count page visits. It does not use cookies and does not identify you personally. Our fonts are loaded from Google Fonts, which receives your IP address in order to deliver them.</p>
          <h2>What you share with us directly</h2>
          <p>When you contact us on WhatsApp or by email, we keep what you send, such as your name, phone number, email address, product details and order information, so we can answer you and handle your order or application.</p>
          <h2>Who we share it with</h2>
          <p>Only the people we need to complete your request: suppliers, shipping and clearing partners for orders, and universities or scholarship bodies for study applications. We do not sell your information.</p>
          <h2>Your choices</h2>
          <p>You can ask us to show, correct or delete the information we hold about you at any time by emailing <a href="mailto:maggloballink@gmail.com">maggloballink@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  </main>
${footer()}`;
}

// ---------- 404 ----------
function notFoundPage() {
  return `${head({ title: 'Page not found | MAG Global Link', description: 'This page could not be found.', path: '/404', noindex: true, preloadHero: false })}
${header('')}

  <main id="main">
    <section class="page-hero page-hero--plain notfound">
      <div class="container">
        <p class="route-code">CN → 404</p>
        <h1>This page got lost in transit</h1>
        <p class="lead">The link may be old or mistyped. Try one of these instead.</p>
        <div class="hero__actions">
          <a href="/" class="btn btn--gold">Go to the home page</a>
          <a href="/import-from-china" class="btn btn--ghost-light">Countries we ship to</a>
          <a href="${waLink()}" class="btn btn--ghost-light" target="_blank" rel="noopener">Ask us on WhatsApp</a>
        </div>
      </div>
    </section>
  </main>
${footer()}`;
}

// ---------- Write ----------
function out(rel, html) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('wrote', rel);
}

for (const c of COUNTRIES) out(`import-from-china/${c.slug}.html`, countryPage(c));
out('import-from-china.html', hubPage());
out('privacy.html', privacyPage());
out('404.html', notFoundPage());

const urls = [
  ['/', '1.0'],
  ['/import-from-china', '0.9'],
  ...COUNTRIES.map((c) => [`/import-from-china/${c.slug}`, '0.9']),
  ['/company-profile', '0.6'],
  ['/privacy', '0.3'],
];
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, pr]) => `  <url><loc>${SITE}${p}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);
out('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
