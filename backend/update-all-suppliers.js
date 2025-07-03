const { sequelize, Supplier } = require('./models');

const supplierUpdates = [
  {
    company: 'PROCAVE GmbH',
    website: 'https://www.procave.de',
    products: 'Matratzenschutz, Bettwäsche, Allergikerbettwäsche',
    special: 'Spezialist für Allergiker-Bettwäsche, Made in Germany'
  },
  {
    company: 'Erwin Müller Versandhaus GmbH',
    website: 'https://www.erwinmueller.com',
    products: 'Bettwäsche, Matratzenschutz, Heimtextilien',
    special: 'Eigene Produktion, BUSINESSLINE für B2B-Kunden'
  },
  {
    company: 'Suprima GmbH',
    website: 'https://www.suprima-gmbh.de',
    products: 'Inkontinenz-Unterwäsche, Bettschutz',
    special: 'Spezialist für Inkontinenzprodukte seit 1982'
  },
  {
    company: 'PAUL HARTMANN AG',
    website: 'https://www.hartmann.de',
    products: 'Medizinische Textilien, Inkontinenzprodukte',
    special: 'Führender europäischer Anbieter von Medizin- und Pflegeprodukten'
  },
  {
    company: 'Abena GmbH',
    website: 'https://www.abena.de',
    products: 'Inkontinenzprodukte, Pflegehilfsmittel',
    special: 'Teil der dänischen Abena-Gruppe'
  },
  {
    company: 'GVS-GROSSVERBRAUCHERSPEZIALISTEN eG',
    website: 'https://www.gvs-eg.de',
    products: 'Medizinische Verbrauchsmaterialien, Inkontinenzprodukte',
    special: 'Einkaufsgemeinschaft für Großverbraucher'
  },
  {
    company: 'Telarion UG (haftungsbeschränkt)',
    website: 'https://www.telarion.de',
    products: 'Medizinische Textilien, Inkontinenzprodukte',
    special: 'Spezialisiert auf innovative Textillösungen'
  },
  {
    company: 'Bäumer Betriebshygiene Vertriebsgesellschaft mbH',
    website: 'https://www.baeumer-hygiene.de',
    products: 'Hygieneartikel, Inkontinenzprodukte',
    special: 'Komplettanbieter für Betriebshygiene'
  },
  {
    company: 'Sanitätshaus Müller GmbH',
    website: 'https://www.sanitaetshaus-mueller.de',
    products: 'Medizinische Hilfsmittel, Inkontinenzprodukte',
    special: 'Sanitätsfachhandel mit breitem Sortiment'
  },
  {
    company: 'RCC Reha Care Competenz GmbH',
    website: 'https://www.rcc-reha.de',
    products: 'Reha-Hilfsmittel, Inkontinenzprodukte',
    special: 'Spezialist für Reha-Bedarf und Pflegehilfsmittel'
  },
  {
    company: 'MIDAS PHARMA GMBH',
    website: 'https://www.midas-pharma.com',
    products: 'Medizinische Produkte, Inkontinenzartikel',
    special: 'Internationaler Pharma-Dienstleister'
  },
  {
    company: 'OSKAR PAHLKE GMBH',
    website: 'https://www.pahlke.de',
    products: 'Medizinische Textilien, Bettschutz',
    special: 'Spezialist für medizinische Textilien seit 1929'
  },
  {
    company: 'TZMO Deutschland GmbH',
    website: 'https://www.tzmo.de',
    products: 'Inkontinenzprodukte, Pflegehilfsmittel',
    special: 'Teil der polnischen TZMO-Gruppe'
  },
  {
    company: 'SC DEMOTEKS MEDIKAL SRL',
    website: 'https://www.demoteks.ro',
    products: 'Medizinische Textilien, Inkontinenzprodukte',
    special: 'Spezialisiert auf medizinische Einwegartikel'
  },
  {
    company: 'COZYWEAVE',
    website: 'https://www.cozyweave.com',
    products: 'Bettwäsche, Heimtextilien',
    special: 'Spezialisiert auf hochwertige Textilien'
  },
  {
    company: 'STD Trend International',
    website: 'https://www.stdtrend.com',
    products: 'Heimtextilien, Bettwäsche',
    special: 'Zertifizierter Textilhersteller, Exportorientiert'
  },
  {
    company: 'Berke Tekstil',
    website: 'https://www.berketekstil.com',
    products: 'Heimtextilien, Bettwäsche',
    special: 'Spezialisiert auf Hoteltextilien und Heimtextilien'
  },
  {
    company: 'UBIOTEX QUALITY LIFE S.L.',
    website: 'https://www.ubiotex.com',
    products: 'Inkontinenzprodukte, Medizinische Textilien',
    special: 'Spezialisiert auf Gesundheitstextilien'
  },
  {
    company: 'MILÉNICA HEALTHCARE S.L.',
    website: 'https://www.milenicahealthcare.com',
    products: 'Inkontinenzprodukte, Medizinische Textilien',
    special: 'Innovative Lösungen für Inkontinenz'
  },
  {
    company: 'ADD Group',
    website: 'https://www.addgroup.it',
    products: 'Inkontinenzprodukte, Pflegehilfsmittel',
    special: 'Spezialisiert auf Gesundheitsprodukte'
  },
  {
    company: 'La Flaura',
    website: 'https://www.laflaura.it',
    products: 'Heimtextilien, Bettwäsche, Inkontinenz-Matratzenschutz',
    special: 'Hochwertige Qualität, direkt von Produzenten'
  },
  {
    company: 'Van der Valk Store',
    website: 'https://www.valkstore.nl',
    products: 'Luxus-Hotelbedarf, Bettwäsche, Bettdecken, Matratzen',
    special: 'Luxushotel-Qualität, Versandkostenfrei ab 45 €'
  },
  {
    company: 'Abena-Frantex',
    website: 'https://www.abena-frantex.fr',
    products: 'Inkontinenzprodukte, Pflegehilfsmittel, Schutz der Bettwäsche',
    special: 'Teil der dänischen Abena-Gruppe, EcoVadis Gold-Medaille'
  },
  {
    company: 'Société Française des Produits d\'Hygiène (SFPH)',
    website: 'https://www.incontinence-sfph.com',
    products: 'Inkontinenzprodukte, Inkontinenz-Unterwäsche, Bettwäsche',
    special: 'Seit 1952 im Bereich Inkontinenz tätig, eigene Produktion in Frankreich'
  }
];

async function updateSuppliers() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    let updated = 0;
    let notFound = [];
    
    for (const update of supplierUpdates) {
      const supplier = await Supplier.findOne({ where: { company: update.company } });
      if (supplier) {
        await supplier.update({
          website: update.website,
          products: update.products,
          special: update.special
        });
        updated++;
        console.log(`Updated: ${update.company}`);
      } else {
        notFound.push(update.company);
        console.log(`Not found: ${update.company}`);
      }
    }
    
    console.log(`\nTotal updated: ${updated}`);
    if (notFound.length > 0) {
      console.log(`Not found: ${notFound.length} companies`);
      console.log(notFound);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateSuppliers();