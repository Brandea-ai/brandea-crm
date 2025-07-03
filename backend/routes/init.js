const express = require('express');
const router = express.Router();
const { Column, Supplier, User } = require('../models');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// Protected route to reinitialize suppliers
router.post('/reinit-suppliers', authenticateToken, async (req, res) => {
  try {
    // Delete all existing suppliers
    await Supplier.destroy({ where: {} });
    
    // Add all 24 suppliers
    const suppliers = [
      { company: 'PROCAVE GmbH', type: 'Hersteller', location: 'Deutschland, Erfurt', email: 'info@procave.de', phone: '+49 361 3400 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 0 },
      { company: 'Erwin Müller Versandhaus GmbH', type: 'Hersteller und Händler', location: 'Deutschland, Buttenwiesen', email: 'service@erwinmueller.de', phone: '+49 9274 960 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 1 },
      { company: 'Suprima GmbH', type: 'Hersteller', location: 'Deutschland, Dürrwangen', email: 'info@suprima.de', phone: '+49 9856 9224 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 2 },
      { company: 'PAUL HARTMANN AG', type: 'Hersteller', location: 'Deutschland, Heidenheim', email: 'info@hartmann.info', phone: '+49 7321 36 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 3 },
      { company: 'Abena GmbH', type: 'Hersteller und Vertriebsunternehmen', location: 'Deutschland, Zörbig', email: 'info@abena.de', phone: '+49 34956 6990', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 4 },
      { company: 'GVS-GROSSVERBRAUCHERSPEZIALISTEN eG', type: 'Großhändler', location: 'Deutschland, Neukirchen', email: 'info@gvs-eg.de', phone: '+49 6674 9999 150', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 5 },
      { company: 'Telarion UG (haftungsbeschränkt)', type: 'Hersteller und Händler', location: 'Deutschland, Bad Homburg', email: 'info@telarion.de', phone: '+49 6172 2655 800', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 6 },
      { company: 'Bäumer Betriebshygiene Vertriebsgesellschaft mbH', type: 'Händler', location: 'Deutschland, Krefeld', email: 'info@baeumer-h.de', phone: '+49 2151 979800', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 7 },
      { company: 'Sanitätshaus Müller GmbH', type: 'Händler', location: 'Deutschland, Aue', email: 'info@sanitaetshaus-mueller.de', phone: '+49 3736 070070', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 8 },
      { company: 'RCC Reha Care Competenz GmbH', type: 'Händler', location: 'Deutschland, Olpe', email: 'info@rcc-reha.de', phone: '+49 2762 40740', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 9 },
      { company: 'MIDAS PHARMA GMBH', type: 'Vertriebsunternehmen', location: 'Deutschland, Ingelheim', email: 'info@midas-pharma.de', phone: '+49 6132 990 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 10 },
      { company: 'OSKAR PAHLKE GMBH', type: 'Hersteller', location: 'Deutschland, Reinbek', email: 'info@pahlke.de', phone: '+49 40 727 702 0', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 11 },
      { company: 'TZMO Deutschland GmbH', type: 'Hersteller und Vertriebsunternehmen', location: 'Deutschland/Polen, Köln', email: 'info@tzmo.de', phone: '+49 221 880 4688', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 12 },
      { company: 'SC DEMOTEKS MEDIKAL SRL', type: 'Hersteller', location: 'Rumänien, Bukarest', email: 'office@demoteks.ro', phone: '+40 21 255 3151', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 13 },
      { company: 'COZYWEAVE', type: 'Hersteller', location: 'Türkei, Istanbul', email: 'info@cozyweave.com', phone: '+90 553 741 9048', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 14 },
      { company: 'STD Trend International', type: 'Hersteller', location: 'Türkei, Istanbul', email: 'info@stdtrend.com', phone: '+90 212 438 4848', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 15 },
      { company: 'Berke Tekstil', type: 'Hersteller', location: 'Türkei, Denizli', email: 'info@berketekstil.com', phone: '+90 258 371 8585', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 16 },
      { company: 'UBIOTEX QUALITY LIFE S.L.', type: 'Hersteller', location: 'Spanien, Alicante', email: 'info@ubiotex.com', phone: '+34 965 661 671', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 17 },
      { company: 'MILÉNICA HEALTHCARE S.L.', type: 'Hersteller', location: 'Spanien, Valencia', email: 'info@milenicahealthcare.com', phone: '+34 961 665 689', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 18 },
      { company: 'ADD Group', type: 'Hersteller und Vertriebsunternehmen', location: 'Italien, Padua', email: 'info@addgroup.it', phone: '+39 049 9461111', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 19 },
      { company: 'La Flaura', type: 'Hersteller und Händler', location: 'Italien, St. Ulrich', email: 'info@laflaura.it', phone: '+39 0471 79 84 57', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 20 },
      { company: 'Van der Valk Store', type: 'Händler', location: 'Niederlande, Breukelen', email: 'support@valkstore.nl', phone: '+31 88 024 6 333', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 21 },
      { company: 'Abena-Frantex', type: 'Hersteller und Vertriebsunternehmen', location: 'Frankreich, Nogent-sur-Oise', email: 'info@abena-frantex.com', phone: '+33 3 4465 6880', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 22 },
      { company: 'Société Française des Produits d\'Hygiène (SFPH)', type: 'Hersteller', location: 'Frankreich, Saint-Soupplets', email: 'sfph@sanygia.com', phone: '+33 1 60 01 35 36', products: 'Wasserdichte Inkontinenz-Bettwäsche', status: 'todo', position: 23 }
    ];
    
    await Supplier.bulkCreate(suppliers);
    
    res.json({ 
      success: true, 
      message: `Successfully reinitialized ${suppliers.length} suppliers` 
    });
  } catch (error) {
    console.error('Reinit error:', error);
    res.status(500).json({ error: 'Failed to reinitialize suppliers' });
  }
});

// Get database status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const columnCount = await Column.count();
    const supplierCount = await Supplier.count();
    const userCount = await User.count();
    
    const suppliers = await Supplier.findAll({
      attributes: ['company', 'status'],
      order: [['company', 'ASC']]
    });
    
    res.json({
      status: 'healthy',
      counts: {
        columns: columnCount,
        suppliers: supplierCount,
        users: userCount
      },
      suppliers: suppliers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;