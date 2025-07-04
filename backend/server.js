const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const rateLimit = require('express-rate-limit');
  const dotenv = require('dotenv');
  const path = require('path');
  const winston = require('winston');

  dotenv.config();

  const authRoutes = require('./routes/auth');
  const suppliersRoutes = require('./routes/suppliers');
  const columnsRoutes = require('./routes/columns');
  const exportRoutes = require('./routes/export');
  const initRoutes = require('./routes/init');
  const { sequelize } = require('./models');

  const app = express();
  const PORT = process.env.PORT || 3001;

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  });

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  app.use(helmet());
  app.use(cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        'https://brandea-kanban.vercel.app',
        'https://brandea-crm.netlify.app',
        'http://localhost:3000'
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.warn(`Blocked request from origin: ${origin}`);
        callback(null, true); // Temporarily allow all origins for debugging
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(limiter);

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/suppliers', suppliersRoutes);
  app.use('/api/columns', columnsRoutes);
  app.use('/api/export', exportRoutes);
  app.use('/api/init', initRoutes);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
  }

  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  sequelize.sync({ force: false }).then(async () => {
    // Check if database is empty and initialize if needed
    const { Column, Supplier, User } = require('./models');
    
    try {
      const columnCount = await Column.count();
      const supplierCount = await Supplier.count();
      const userCount = await User.count();
      
      logger.info(`Database status - Columns: ${columnCount}, Suppliers: ${supplierCount}, Users: ${userCount}`);
      
      if (columnCount === 0) {
        logger.info('Initializing columns...');

      // Create columns
      const columns = [
        { id: 'todo', name: 'Zu kontaktieren', order: 0 },
        { id: 'contacted', name: 'Kontaktiert', order: 1 },
        { id: 'offer', name: 'Angebot erhalten', order: 2 },
        { id: 'done', name: 'Abgeschlossen', order: 3 }
      ];

      await Column.bulkCreate(columns);

      // Create sample suppliers
      const suppliers = [
        { company: 'PROCAVE GmbH', type: 'Hersteller', location: 'Deutschland, Erfurt', email: 'info@procave.de', phone: '+49 361 3400 0', website: 'https://www.procave.de', products: 'Matratzenschutz, Bettwäsche, Allergikerbettwäsche', special: 'Spezialist für Allergiker-Bettwäsche, Made in Germany', status: 'todo', position: 0 },
        { company: 'Erwin Müller Versandhaus GmbH', type: 'Hersteller und Händler', location: 'Deutschland, Buttenwiesen', email: 'service@erwinmueller.com', phone: '+49 9274 960 0', website: 'https://www.erwinmueller.com', products: 'Bettwäsche, Matratzenschutz, Heimtextilien', special: 'Eigene Produktion, BUSINESSLINE für B2B-Kunden', status: 'todo', position: 1 },
        { company: 'Suprima GmbH', type: 'Hersteller', location: 'Deutschland, Dürrwangen', email: 'info@suprima.de', phone: '+49 9856 9224 0', website: 'https://www.suprima-gmbh.de', products: 'Inkontinenz-Unterwäsche, Bettschutz', special: 'Spezialist für Inkontinenzprodukte seit 1982', status: 'todo', position: 2 },
        { company: 'PAUL HARTMANN AG', type: 'Hersteller', location: 'Deutschland, Heidenheim', email: 'info@hartmann.info', phone: '+49 7321 36 0', website: 'https://www.hartmann.de', products: 'Medizinische Textilien, Inkontinenzprodukte', special: 'Führender europäischer Anbieter von Medizin- und Pflegeprodukten', status: 'todo', position: 3 },
        { company: 'Abena GmbH', type: 'Hersteller und Vertriebsunternehmen', location: 'Deutschland, Zörbig', email: 'info@abena.de', phone: '+49 34956 6990', website: 'https://www.abena.de', products: 'Inkontinenzprodukte, Pflegehilfsmittel', special: 'Teil der dänischen Abena-Gruppe', status: 'todo', position: 4 },
        { company: 'GVS-GROSSVERBRAUCHERSPEZIALISTEN eG', type: 'Großhändler', location: 'Deutschland, Neukirchen', email: 'info@gvs-eg.de', phone: '+49 6674 9999 150', website: 'https://www.gvs-eg.de', products: 'Medizinische Verbrauchsmaterialien, Inkontinenzprodukte', special: 'Einkaufsgemeinschaft für Großverbraucher', status: 'todo', position: 5 },
        { company: 'Telarion UG (haftungsbeschränkt)', type: 'Hersteller und Händler', location: 'Deutschland, Bad Homburg', email: 'info@telarion.de', phone: '+49 6172 2655 800', website: 'https://www.telarion.de', products: 'Medizinische Textilien, Inkontinenzprodukte', special: 'Spezialisiert auf innovative Textillösungen', status: 'todo', position: 6 },
        { company: 'Bäumer Betriebshygiene Vertriebsgesellschaft mbH', type: 'Händler', location: 'Deutschland, Krefeld', email: 'info@baeumer-hygiene.de', phone: '+49 2151 979800', website: 'https://www.baeumer-hygiene.de', products: 'Hygieneartikel, Inkontinenzprodukte', special: 'Komplettanbieter für Betriebshygiene', status: 'todo', position: 7 },
        { company: 'Sanitätshaus Müller GmbH', type: 'Händler', location: 'Deutschland, Aue', email: 'info@sanitaetshaus-mueller.de', phone: '+49 3736 070070', website: 'https://www.sanitaetshaus-mueller.de', products: 'Medizinische Hilfsmittel, Inkontinenzprodukte', special: 'Sanitätsfachhandel mit breitem Sortiment', status: 'todo', position: 8 },
        { company: 'RCC Reha Care Competenz GmbH', type: 'Händler', location: 'Deutschland, Olpe', email: 'info@rcc-reha.de', phone: '+49 2762 40740', website: 'https://www.rcc-reha.de', products: 'Reha-Hilfsmittel, Inkontinenzprodukte', special: 'Spezialist für Reha-Bedarf und Pflegehilfsmittel', status: 'todo', position: 9 },
        { company: 'MIDAS PHARMA GMBH', type: 'Vertriebsunternehmen', location: 'Deutschland, Ingelheim', email: 'info@midas-pharma.com', phone: '+49 6132 990 0', website: 'https://www.midas-pharma.com', products: 'Medizinische Produkte, Inkontinenzartikel', special: 'Internationaler Pharma-Dienstleister', status: 'todo', position: 10 },
        { company: 'OSKAR PAHLKE GMBH', type: 'Hersteller', location: 'Deutschland, Reinbek', email: 'info@pahlke.de', phone: '+49 40 727 702 0', website: 'https://www.pahlke.de', products: 'Medizinische Textilien, Bettschutz', special: 'Spezialist für medizinische Textilien seit 1929', status: 'todo', position: 11 },
        { company: 'TZMO Deutschland GmbH', type: 'Hersteller und Vertriebsunternehmen', location: 'Deutschland/Polen, Köln', email: 'info@tzmo.de', phone: '+49 221 880 4688', website: 'https://www.tzmo.de', products: 'Inkontinenzprodukte, Pflegehilfsmittel', special: 'Teil der polnischen TZMO-Gruppe', status: 'todo', position: 12 },
        { company: 'SC DEMOTEKS MEDIKAL SRL', type: 'Hersteller', location: 'Rumänien, Bukarest', email: 'office@demoteks.ro', phone: '+40 21 255 3151', website: 'https://www.demoteks.ro', products: 'Medizinische Textilien, Inkontinenzprodukte', special: 'Spezialisiert auf medizinische Einwegartikel', status: 'todo', position: 13 },
        { company: 'COZYWEAVE', type: 'Hersteller', location: 'Türkei, Istanbul', email: 'info@cozyweave.com', phone: '+90 553 741 9048', website: 'https://www.cozyweave.com', products: 'Bettwäsche, Heimtextilien', special: 'Spezialisiert auf hochwertige Textilien', status: 'todo', position: 14 },
        { company: 'STD Trend International', type: 'Hersteller', location: 'Türkei, Istanbul', email: 'info@stdtrend.com', phone: '+90 212 438 4848', website: 'https://www.stdtrend.com', products: 'Heimtextilien, Bettwäsche', special: 'Zertifizierter Textilhersteller, Exportorientiert', status: 'todo', position: 15 },
        { company: 'Berke Tekstil', type: 'Hersteller', location: 'Türkei, Denizli', email: 'info@berketekstil.com', phone: '+90 258 371 8585', website: 'https://www.berketekstil.com', products: 'Heimtextilien, Bettwäsche', special: 'Spezialisiert auf Hoteltextilien und Heimtextilien', status: 'todo', position: 16 },
        { company: 'UBIOTEX QUALITY LIFE S.L.', type: 'Hersteller', location: 'Spanien, Alicante', email: 'info@ubiotex.com', phone: '+34 965 661 671', website: 'https://www.ubiotex.com', products: 'Inkontinenzprodukte, Medizinische Textilien', special: 'Spezialisiert auf Gesundheitstextilien', status: 'todo', position: 17 },
        { company: 'MILÉNICA HEALTHCARE S.L.', type: 'Hersteller', location: 'Spanien, Valencia', email: 'info@milenicahealthcare.com', phone: '+34 961 665 689', website: 'https://www.milenicahealthcare.com', products: 'Inkontinenzprodukte, Medizinische Textilien', special: 'Innovative Lösungen für Inkontinenz', status: 'todo', position: 18 },
        { company: 'ADD Group', type: 'Hersteller und Vertriebsunternehmen', location: 'Italien, Padua', email: 'info@addgroup.it', phone: '+39 049 9461111', website: 'https://www.addgroup.it', products: 'Inkontinenzprodukte, Pflegehilfsmittel', special: 'Spezialisiert auf Gesundheitsprodukte', status: 'todo', position: 19 },
        { company: 'La Flaura', type: 'Hersteller und Händler', location: 'Italien, St. Ulrich', email: 'info@laflaura.it', phone: '+39 0471 79 84 57', website: 'https://www.laflaura.it', products: 'Heimtextilien, Bettwäsche, Inkontinenz-Matratzenschutz', special: 'Hochwertige Qualität, direkt von Produzenten', status: 'todo', position: 20 },
        { company: 'Van der Valk Store', type: 'Händler', location: 'Niederlande, Breukelen', email: 'support@valkstore.nl', phone: '+31 88 024 6 333', website: 'https://www.valkstore.nl', products: 'Luxus-Hotelbedarf, Bettwäsche, Bettdecken, Matratzen', special: 'Luxushotel-Qualität, Versandkostenfrei ab 45 €', status: 'todo', position: 21 },
        { company: 'Abena-Frantex', type: 'Hersteller und Vertriebsunternehmen', location: 'Frankreich, Nogent-sur-Oise', email: 'info@abena-frantex.com', phone: '+33 3 4465 6880', website: 'https://www.abena-frantex.fr', products: 'Inkontinenzprodukte, Pflegehilfsmittel, Schutz der Bettwäsche', special: 'Teil der dänischen Abena-Gruppe, EcoVadis Gold-Medaille', status: 'todo', position: 22 },
        { company: 'Société Française des Produits d\'Hygiène (SFPH)', type: 'Hersteller', location: 'Frankreich, Saint-Soupplets', email: 'sfph@sanygia.com', phone: '+33 1 60 01 35 36', website: 'https://www.incontinence-sfph.com', products: 'Inkontinenzprodukte, Inkontinenz-Unterwäsche, Bettwäsche', special: 'Seit 1952 im Bereich Inkontinenz tätig, eigene Produktion in Frankreich', status: 'todo', position: 23 }
      ];

      await Supplier.bulkCreate(suppliers);
      logger.info(`Created ${suppliers.length} suppliers`);
    }
    
    // Create default user if not exists
    if (userCount === 0) {
      logger.info('Creating default user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('BrandeaTexamed2025', 10);
      await User.create({
        username: 'Brandea-Texamed',
        password_hash: hashedPassword
      });
      logger.info('Default user created');
    }
    
    // Final status
    const finalSupplierCount = await Supplier.count();
    logger.info(`Database initialization complete. Total suppliers: ${finalSupplierCount}`);
    
  } catch (error) {
    logger.error('Database initialization error:', error);
    // Don't crash the server, continue running
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Unable to connect to the database:', err);
  process.exit(1);
});
