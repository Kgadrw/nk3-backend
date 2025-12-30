const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// Get all partners
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create partner
router.post('/', async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete partner
router.delete('/:id', async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

