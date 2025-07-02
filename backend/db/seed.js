const bcrypt = require('bcryptjs');
const { sequelize, User, Supplier, Column } = require('../models');

const initialSuppliers = [
    {
        company: "PROCAVE GmbH",
        type: "Hersteller",
        location: "Deutschland, Erfurt",
        contact: "",
        email: "info@procave.de",
        phone: "+49 361 3400 0",
        website: "www.procave.de",
        products: "Matratzenschutz, Bettwäsche, Allergikerbettwäsche",
        special: "Spezialist für Allergiker-Bettwäsche, Made in Germany",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Erwin Müller Versandhaus GmbH",
        type: "Hersteller und Händler",
        location: "Deutschland, Buttenwiesen",
        contact: "",
        email: "service@erwinmueller.com",
        phone: "+49 9274 960 0",
        website: "www.erwinmueller.com",
        products: "Bettwäsche, Matratzenschutz, Heimtextilien",
        special: "Eigene Produktion, BUSINESSLINE für B2B-Kunden",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Suprima GmbH",
        type: "Hersteller",
        location: "Deutschland, Dürrwangen",
        contact: "",
        email: "info@suprima.de",
        phone: "+49 9856 9224 0",
        website: "www.suprima-gmbh.de",
        products: "Inkontinenz-Unterwäsche, Bettschutz",
        special: "Spezialist für Inkontinenzprodukte seit 1982",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "PAUL HARTMANN AG",
        type: "Hersteller",
        location: "Deutschland, Heidenheim",
        contact: "",
        email: "info@hartmann.info",
        phone: "+49 7321 36 0",
        website: "www.hartmann.de",
        products: "Medizinische Textilien, Inkontinenzprodukte",
        special: "Führender europäischer Anbieter von Medizin- und Pflegeprodukten",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Abena GmbH",
        type: "Hersteller und Vertriebsunternehmen",
        location: "Deutschland, Zörbig",
        contact: "",
        email: "info@abena.de",
        phone: "+49 34956 6990",
        website: "www.abena.de",
        products: "Inkontinenzprodukte, Pflegehilfsmittel",
        special: "Teil der dänischen Abena-Gruppe",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "GVS-GROSSVERBRAUCHERSPEZIALISTEN eG",
        type: "Großhändler",
        location: "Deutschland, Neukirchen",
        contact: "",
        email: "info@gvs-eg.de",
        phone: "+49 6674 9999 150",
        website: "www.gvs-eg.de",
        products: "Medizinische Verbrauchsmaterialien, Inkontinenzprodukte",
        special: "Einkaufsgemeinschaft für Großverbraucher",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Telarion UG (haftungsbeschränkt)",
        type: "Hersteller und Händler",
        location: "Deutschland, Bad Homburg",
        contact: "",
        email: "info@telarion.de",
        phone: "+49 6172 2655 800",
        website: "www.telarion.de",
        products: "Medizinische Textilien, Inkontinenzprodukte",
        special: "Spezialisiert auf innovative Textillösungen",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Bäumer Betriebshygiene Vertriebsgesellschaft mbH",
        type: "Händler",
        location: "Deutschland, Krefeld",
        contact: "",
        email: "info@baeumer-hygiene.de",
        phone: "+49 2151 979800",
        website: "www.baeumer-hygiene.de",
        products: "Hygieneartikel, Inkontinenzprodukte",
        special: "Komplettanbieter für Betriebshygiene",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Sanitätshaus Müller GmbH",
        type: "Händler",
        location: "Deutschland, Aue",
        contact: "",
        email: "info@sanitaetshaus-mueller.de",
        phone: "+49 3736 070070",
        website: "www.sanitaetshaus-mueller.de",
        products: "Medizinische Hilfsmittel, Inkontinenzprodukte",
        special: "Sanitätsfachhandel mit breitem Sortiment",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "RCC Reha Care Competenz GmbH",
        type: "Händler",
        location: "Deutschland, Olpe",
        contact: "",
        email: "info@rcc-reha.de",
        phone: "+49 2762 40740",
        website: "www.rcc-reha.de",
        products: "Reha-Hilfsmittel, Inkontinenzprodukte",
        special: "Spezialist für Reha-Bedarf und Pflegehilfsmittel",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "MIDAS PHARMA GMBH",
        type: "Vertriebsunternehmen",
        location: "Deutschland, Ingelheim",
        contact: "",
        email: "info@midas-pharma.com",
        phone: "+49 6132 990 0",
        website: "www.midas-pharma.com",
        products: "Medizinische Produkte, Inkontinenzartikel",
        special: "Internationaler Pharma-Dienstleister",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "OSKAR PAHLKE GMBH",
        type: "Hersteller",
        location: "Deutschland, Reinbek",
        contact: "",
        email: "info@pahlke.de",
        phone: "+49 40 727 702 0",
        website: "www.pahlke.de",
        products: "Medizinische Textilien, Bettschutz",
        special: "Spezialist für medizinische Textilien seit 1929",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "TZMO Deutschland GmbH",
        type: "Hersteller und Vertriebsunternehmen",
        location: "Deutschland/Polen, Köln",
        contact: "",
        email: "info@tzmo.de",
        phone: "+49 221 880 4688",
        website: "www.tzmo.de",
        products: "Inkontinenzprodukte, Pflegehilfsmittel",
        special: "Teil der polnischen TZMO-Gruppe",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "SC DEMOTEKS MEDIKAL SRL",
        type: "Hersteller",
        location: "Rumänien, Bukarest",
        contact: "",
        email: "office@demoteks.ro",
        phone: "+40 21 255 3151",
        website: "www.demoteks.ro",
        products: "Medizinische Textilien, Inkontinenzprodukte",
        special: "Spezialisiert auf medizinische Einwegartikel",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "COZYWEAVE",
        type: "Hersteller",
        location: "Türkei, Istanbul",
        contact: "",
        email: "info@cozyweave.com",
        phone: "+90 553 741 9048",
        website: "www.cozyweave.com",
        products: "Bettwäsche, Heimtextilien",
        special: "Spezialisiert auf hochwertige Textilien",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "STD Trend International",
        type: "Hersteller",
        location: "Türkei, Istanbul",
        contact: "",
        email: "info@stdtrend.com",
        phone: "+90 212 438 4848",
        website: "www.stdtrend.com",
        products: "Heimtextilien, Bettwäsche",
        special: "Zertifizierter Textilhersteller, Exportorientiert",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Berke Tekstil",
        type: "Hersteller",
        location: "Türkei, Denizli",
        contact: "",
        email: "info@berketekstil.com",
        phone: "+90 258 371 8585",
        website: "www.berketekstil.com",
        products: "Heimtextilien, Bettwäsche",
        special: "Spezialisiert auf Hoteltextilien und Heimtextilien",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "UBIOTEX QUALITY LIFE S.L.",
        type: "Hersteller",
        location: "Spanien, Alicante",
        contact: "",
        email: "info@ubiotex.com",
        phone: "+34 965 661 671",
        website: "www.ubiotex.com",
        products: "Inkontinenzprodukte, Medizinische Textilien",
        special: "Spezialisiert auf Gesundheitstextilien",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "MILÉNICA HEALTHCARE S.L.",
        type: "Hersteller",
        location: "Spanien, Valencia",
        contact: "",
        email: "info@milenicahealthcare.com",
        phone: "+34 961 665 689",
        website: "www.milenicahealthcare.com",
        products: "Inkontinenzprodukte, Medizinische Textilien",
        special: "Innovative Lösungen für Inkontinenz",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "ADD Group",
        type: "Hersteller und Vertriebsunternehmen",
        location: "Italien, Padua",
        contact: "",
        email: "info@addgroup.it",
        phone: "+39 049 9461111",
        website: "www.addgroup.it",
        products: "Inkontinenzprodukte, Pflegehilfsmittel",
        special: "Spezialisiert auf Gesundheitsprodukte",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "La Flaura",
        type: "Hersteller und Händler",
        location: "Italien, St. Ulrich",
        contact: "",
        email: "info@laflaura.it",
        phone: "+39 0471 79 84 57",
        website: "www.laflaura.it",
        products: "Heimtextilien, Bettwäsche, Inkontinenz-Matratzenschutz",
        special: "Hochwertige Qualität, direkt von Produzenten",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Van der Valk Store",
        type: "Händler",
        location: "Niederlande, Breukelen",
        contact: "",
        email: "support@valkstore.nl",
        phone: "+31 88 024 6 333",
        website: "www.valkstore.nl",
        products: "Luxus-Hotelbedarf, Bettwäsche, Bettdecken, Matratzen",
        special: "Luxushotel-Qualität, Versandkostenfrei ab 45 €",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Abena-Frantex",
        type: "Hersteller und Vertriebsunternehmen",
        location: "Frankreich, Nogent-sur-Oise",
        contact: "",
        email: "info@abena-frantex.com",
        phone: "+33 3 4465 6880",
        website: "www.abena-frantex.fr",
        products: "Inkontinenzprodukte, Pflegehilfsmittel, Schutz der Bettwäsche",
        special: "Teil der dänischen Abena-Gruppe, EcoVadis Gold-Medaille",
        price: "",
        notes: "",
        status: "todo"
    },
    {
        company: "Société Française des Produits d'Hygiène (SFPH)",
        type: "Hersteller",
        location: "Frankreich, Saint-Soupplets",
        contact: "",
        email: "sfph@sanygia.com",
        phone: "+33 1 60 01 35 36",
        website: "www.incontinence-sfph.com",
        products: "Inkontinenzprodukte, Inkontinenz-Unterwäsche, Bettwäsche",
        special: "Seit 1952 im Bereich Inkontinenz tätig, eigene Produktion in Frankreich",
        price: "",
        notes: "",
        status: "todo"
    }
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const passwordHash = await bcrypt.hash('BrandeaTexamed2025', 10);
    await User.create({
      username: 'Brandea-Texamed',
      password_hash: passwordHash
    });
    console.log('Default user created');

    const columns = [
      { id: 'todo', name: 'Zu kontaktieren', position: 0 },
      { id: 'contacted', name: 'Kontaktiert', position: 1 },
      { id: 'offer', name: 'Angebot erhalten', position: 2 },
      { id: 'completed', name: 'Abgeschlossen', position: 3 }
    ];
    await Column.bulkCreate(columns);
    console.log('Columns created');

    const suppliersWithPosition = initialSuppliers.map((supplier, index) => ({
      ...supplier,
      position: index
    }));
    await Supplier.bulkCreate(suppliersWithPosition);
    console.log('Initial suppliers created');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();