const express = require('express');
const { Supplier } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/csv', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [['status', 'ASC'], ['position', 'ASC']]
    });

    const headers = [
      'ID',
      'Firma',
      'Typ',
      'Standort',
      'Kontaktperson',
      'E-Mail',
      'Telefon',
      'Website',
      'Produkte',
      'Besonderheiten',
      'Preise',
      'Notizen',
      'Status',
      'Erstellt am',
      'Aktualisiert am'
    ];

    const csvRows = [headers.join(';')];

    suppliers.forEach(supplier => {
      const row = [
        supplier.id,
        `"${(supplier.company || '').replace(/"/g, '""')}"`,
        `"${(supplier.type || '').replace(/"/g, '""')}"`,
        `"${(supplier.location || '').replace(/"/g, '""')}"`,
        `"${(supplier.contact || '').replace(/"/g, '""')}"`,
        `"${(supplier.email || '').replace(/"/g, '""')}"`,
        `"${(supplier.phone || '').replace(/"/g, '""')}"`,
        `"${(supplier.website || '').replace(/"/g, '""')}"`,
        `"${(supplier.products || '').replace(/"/g, '""')}"`,
        `"${(supplier.special || '').replace(/"/g, '""')}"`,
        `"${(supplier.price || '').replace(/"/g, '""')}"`,
        `"${(supplier.notes || '').replace(/"/g, '""')}"`,
        supplier.status,
        supplier.createdAt.toISOString(),
        supplier.updatedAt.toISOString()
      ];
      csvRows.push(row.join(';'));
    });

    const csvContent = csvRows.join('\n');
    const bom = '\ufeff';

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="brandea_suppliers_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(bom + csvContent);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

module.exports = router;