const { sequelize, User, Supplier, Column } = require('./models');
const bcrypt = require('bcryptjs');

const suppliers = [
  {company: 'PROCAVE GmbH', type: 'Hersteller', location: 'Deutschland, Erfurt', email: 'info@procave.de', phone: '+49 361 3400 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Erwin Müller Versandhaus GmbH', type: 'Hersteller und Händler', location: 'Deutschland, Buttenwiesen', email: 'service@erwinmueller.com', phone: '+49 9274 960 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Suprima GmbH', type: 'Hersteller', location: 'Deutschland, Dürrwangen', email: 'info@suprima.de', phone: '+49 9856 9224 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'PAUL HARTMANN AG', type: 'Hersteller', location: 'Deutschland, Heidenheim', email: 'info@hartmann.info', phone: '+49 7321 36 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Abena GmbH', type: 'Hersteller und Vertriebsunternehmen', location: 'Deutschland, Zörbig', email: 'info@abena.de', phone: '+49 34956 6990', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'GVS-GROSSVERBRAUCHERSPEZIALISTEN eG', type: 'Großhändler', location: 'Deutschland, Neukirchen', email: 'info@gvs-eg.de', phone: '+49 6674 9999 150', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Telarion UG (haftungsbeschränkt)', type: 'Hersteller und Händler', location: 'Deutschland, Bad Homburg', email: 'info@telarion.de', phone: '+49 6172 2655 800', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Bäumer Betriebshygiene Vertriebsgesellschaft mbH', type: 'Händler', location: 'Deutschland, Krefeld', email: 'info@baeumer-hygiene.de', phone: '+49 2151 979800', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Sanitätshaus Müller GmbH', type: 'Händler', location: 'Deutschland, Aue', email: 'info@sanitaetshaus-mueller.de', phone: '+49 3736 070070', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'RCC Reha Care Competenz GmbH', type: 'Händler', location: 'Deutschland, Olpe', email: 'info@rcc-reha.de', phone: '+49 2762 40740', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'MIDAS PHARMA GMBH', type: 'Vertriebsunternehmen', location: 'Deutschland, Ingelheim', email: 'info@midas-pharma.com', phone: '+49 6132 990 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'OSKAR PAHLKE GMBH', type: 'Hersteller', location: 'Deutschland, Reinbek', email: 'info@pahlke.de', phone: '+49 40 727 702 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'TZMO Deutschland GmbH', type: 'Hersteller und Vertriebsunternehmen', location: 'Deutschland/Polen, Köln', email: 'info@tzmo.de', phone: '+49 221 880 4688', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'SC DEMOTEKS MEDIKAL SRL', type: 'Hersteller', location: 'Rumänien, Bukarest', email: 'office@demoteks.ro', phone: '+40 21 255 3151', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'COZYWEAVE', type: 'Hersteller', location: 'Türkei, Istanbul', email: 'info@cozyweave.com', phone: '+90 553 741 9048', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'STD Trend International', type: 'Hersteller', location: 'Türkei, Istanbul', email: 'info@stdtrend.com', phone: '+90 212 438 4848', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Berke Tekstil', type: 'Hersteller', location: 'Türkei, Denizli', email: 'info@berketekstil.com', phone: '+90 258 371 8585', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'UBIOTEX QUALITY LIFE S.L.', type: 'Hersteller', location: 'Spanien, Alicante', email: 'info@ubiotex.com', phone: '+34 965 661 671', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'MILÉNICA HEALTHCARE S.L.', type: 'Hersteller', location: 'Spanien, Valencia', email: 'info@milenicahealthcare.com', phone: '+34 961 665 689', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'ADD Group', type: 'Hersteller und Vertriebsunternehmen', location: 'Italien, Padua', email: 'info@addgroup.it', phone: '+39 049 9461111', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'La Flaura', type: 'Hersteller und Händler', location: 'Italien, St. Ulrich', email: 'info@laflaura.it', phone: '+39 0471 79 84 57', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Van der Valk Store', type: 'Händler', location: 'Niederlande, Breukelen', email: 'support@valkstore.nl', phone: '+31 88 024 6 333', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Abena-Frantex', type: 'Hersteller und Vertriebsunternehmen', location: 'Frankreich, Nogent-sur-Oise', email: 'info@abena-frantex.com', phone: '+33 3 4465 6880', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'},
  {company: 'Société Française des Produits d\'Hygiène (SFPH)', type: 'Hersteller', location: 'Frankreich, Saint-Soupplets', email: 'sfph@sanygia.com', phone: '+33 1 60 01 35 36', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo'}
];

async function migrateData() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Create tables if they don't exist
    await sequelize.sync();

    // Check if default user exists
    const existingUser = await User.findOne({ where: { username: 'Brandea-Texamed' } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('BrandeaTexamed2025', 10);
      await User.create({
        username: 'Brandea-Texamed',
        password_hash: hashedPassword
      });
      console.log('Default user created');
    }

    // Create columns if they don't exist
    const columns = [
      { id: 'todo', name: 'Zu kontaktieren', position: 0 },
      { id: 'contacted', name: 'Kontaktiert', position: 1 },
      { id: 'offer', name: 'Angebot erhalten', position: 2 },
      { id: 'done', name: 'Abgeschlossen', position: 3 }
    ];

    for (const col of columns) {
      await Column.findOrCreate({ where: { id: col.id }, defaults: col });
    }
    console.log('Columns created');

    // Add suppliers
    let added = 0;
    for (const supplier of suppliers) {
      const [created, wasCreated] = await Supplier.findOrCreate({
        where: { company: supplier.company },
        defaults: { ...supplier, position: 0 }
      });
      if (wasCreated) {
        added++;
        console.log('Added:', supplier.company);
      }
    }
    console.log(`Total suppliers added: ${added}`);
    
    const totalSuppliers = await Supplier.count();
    console.log(`Total suppliers in database: ${totalSuppliers}`);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();