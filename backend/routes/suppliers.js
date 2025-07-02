const express = require('express');
const { body, validationResult } = require('express-validator');
const { Supplier, ActivityLog } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [['status', 'ASC'], ['position', 'ASC']]
    });
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

router.post('/', [
  body('company').notEmpty().withMessage('Company name is required'),
  body('status').isIn(['todo', 'contacted', 'offer', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const maxPosition = await Supplier.max('position', {
      where: { status: req.body.status || 'todo' }
    }) || 0;

    const supplier = await Supplier.create({
      ...req.body,
      position: maxPosition + 1
    });

    await ActivityLog.create({
      action: 'created',
      supplier_id: supplier.id,
      user_id: req.user.id
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    await supplier.update(req.body);

    await ActivityLog.create({
      action: 'updated',
      supplier_id: supplier.id,
      user_id: req.user.id
    });

    res.json(supplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    await ActivityLog.create({
      action: 'deleted',
      supplier_id: supplier.id,
      user_id: req.user.id
    });

    await supplier.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

// Simplified move endpoint
router.put('/:id/move', [
  body('newStatus').isIn(['todo', 'contacted', 'offer', 'completed']).withMessage('Invalid status'),
  body('newPosition').isInt({ min: 0 }).withMessage('Invalid position')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { newStatus, newPosition } = req.body;
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const oldStatus = supplier.status;

    // Simple position update - just update this supplier
    await supplier.update({
      status: newStatus,
      position: newPosition
    });

    await ActivityLog.create({
      action: `moved from ${oldStatus} to ${newStatus}`,
      supplier_id: supplier.id,
      user_id: req.user.id
    });

    res.json(supplier);
  } catch (error) {
    console.error('Error moving supplier:', error);
    res.status(500).json({ error: 'Failed to move supplier' });
  }
});

// Simplified status change endpoint  
router.put('/:id/status', [
  body('status').isIn(['todo', 'contacted', 'offer', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const oldStatus = supplier.status;
    const newStatus = req.body.status;

    if (oldStatus !== newStatus) {
      // Get max position in new status column
      const maxPosition = await Supplier.max('position', {
        where: { status: newStatus }
      }) || 0;

      await supplier.update({
        status: newStatus,
        position: maxPosition + 1
      });

      await ActivityLog.create({
        action: `status changed from ${oldStatus} to ${newStatus}`,
        supplier_id: supplier.id,
        user_id: req.user.id
      });
    }

    res.json(supplier);
  } catch (error) {
    console.error('Error updating supplier status:', error);
    res.status(500).json({ error: 'Failed to update supplier status' });
  }
});

module.exports = router;