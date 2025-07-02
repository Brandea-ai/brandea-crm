const express = require('express');
const { Column } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    let columns = await Column.findAll({
      order: [['position', 'ASC']]
    });

    if (columns.length === 0) {
      const defaultColumns = [
        { id: 'todo', name: 'Zu kontaktieren', position: 0 },
        { id: 'contacted', name: 'Kontaktiert', position: 1 },
        { id: 'offer', name: 'Angebot erhalten', position: 2 },
        { id: 'completed', name: 'Abgeschlossen', position: 3 }
      ];

      columns = await Column.bulkCreate(defaultColumns);
    }

    res.json(columns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const column = await Column.findByPk(req.params.id);
    
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    await column.update(req.body);
    res.json(column);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Failed to update column' });
  }
});

module.exports = router;