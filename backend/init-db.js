const { sequelize, Supplier, Column } = require('./models');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Force sync to create tables
    await sequelize.sync({ force: true });
    
    // Create columns
    const columns = [
      { id: 'todo', name: 'Zu kontaktieren', order: 0 },
      { id: 'contacted', name: 'Kontaktiert', order: 1 },
      { id: 'offer', name: 'Angebot erhalten', order: 2 },
      { id: 'done', name: 'Abgeschlossen', order: 3 }
    ];
    
    await Column.bulkCreate(columns);
    console.log('Columns created');
    
    // Create sample suppliers
    const suppliers = [
      { company: 'TechMed Solutions GmbH', type: 'Medizintechnik', location: 'München', status: 'todo', position: 0 },
      { company: 'PharmaDirect AG', type: 'Pharmazeutika', location: 'Frankfurt', status: 'todo', position: 1 },
      { company: 'MediSupply Berlin', type: 'Verbrauchsmaterial', location: 'Berlin', status: 'todo', position: 2 },
      { company: 'BioTech Innovations', type: 'Biotechnologie', location: 'Hamburg', status: 'todo', position: 3 },
      { company: 'CarePlus Logistics', type: 'Logistik', location: 'Düsseldorf', status: 'contacted', position: 0 },
      { company: 'HealthFirst Supplies', type: 'Medizinprodukte', location: 'Stuttgart', status: 'contacted', position: 1 },
      { company: 'Digital Health Systems', type: 'IT/Software', location: 'Köln', status: 'contacted', position: 2 },
      { company: 'MedEquip Pro', type: 'Geräte', location: 'Leipzig', status: 'contacted', position: 3 },
      { company: 'Surgical Instruments Co', type: 'Chirurgiebedarf', location: 'Nürnberg', status: 'offer', position: 0 },
      { company: 'LabTech Solutions', type: 'Laborausstattung', location: 'Dresden', status: 'offer', position: 1 },
      { company: 'Emergency Medical Supply', type: 'Notfallmedizin', location: 'Hannover', status: 'offer', position: 2 },
      { company: 'Diagnostic Partners', type: 'Diagnostik', location: 'Bremen', status: 'offer', position: 3 },
      { company: 'Wellness & Care GmbH', type: 'Pflegeprodukte', location: 'Essen', status: 'done', position: 0 },
      { company: 'MedService International', type: 'Service/Wartung', location: 'Dortmund', status: 'done', position: 1 },
      { company: 'Pharma Wholesale', type: 'Großhandel', location: 'Mannheim', status: 'done', position: 2 },
      { company: 'Clinic Supplies Direct', type: 'Klinikbedarf', location: 'Karlsruhe', status: 'done', position: 3 },
      { company: 'Dental Supply Chain', type: 'Dentalprodukte', location: 'Wiesbaden', status: 'todo', position: 4 },
      { company: 'Ortho Medical Systems', type: 'Orthopädie', location: 'Mainz', status: 'todo', position: 5 },
      { company: 'Cardio Tech Europe', type: 'Kardiologie', location: 'Bonn', status: 'contacted', position: 4 },
      { company: 'Neuro Instruments Ltd', type: 'Neurologie', location: 'Heidelberg', status: 'contacted', position: 5 },
      { company: 'Imaging Solutions Pro', type: 'Bildgebung', location: 'Freiburg', status: 'offer', position: 4 },
      { company: 'Rehab Equipment Plus', type: 'Rehabilitation', location: 'Augsburg', status: 'offer', position: 5 },
      { company: 'Sterilization Systems', type: 'Sterilisation', location: 'Regensburg', status: 'done', position: 4 },
      { company: 'Patient Care Innovations', type: 'Patientenpflege', location: 'Erfurt', status: 'done', position: 5 }
    ];
    
    await Supplier.bulkCreate(suppliers);
    console.log('Sample suppliers created');
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();