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
  const { Column, Supplier } = require('./models');
  const columnCount = await Column.count();
  
  if (columnCount === 0) {
    logger.info('Empty database detected, initializing...');
    
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
      { company: 'TechMed Solutions GmbH', type: 'Medizintechnik', location: 'München', status: 'todo', position: 0 },
      { company: 'PharmaDirect AG', type: 'Pharmazeutika', location: 'Frankfurt', status: 'todo', position: 1 },
      { company: 'MediSupply Berlin', type: 'Verbrauchsmaterial', location: 'Berlin', status: 'todo', position: 2 },
      { company: 'BioTech Innovations', type: 'Biotechnologie', location: 'Hamburg', status: 'todo', position: 3 },
      { company: 'CarePlus Logistics', type: 'Logistik', location: 'Düsseldorf', status: 'contacted', position: 0 },
      { company: 'HealthFirst Supplies', type: 'Medizinprodukte', location: 'Stuttgart', status: 'contacted', position: 1 }
    ];
    
    await Supplier.bulkCreate(suppliers);
    logger.info('Database initialized with sample data');
  }
  
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Unable to connect to the database:', err);
});