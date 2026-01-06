const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// Get all active hero texts
router.get('/', async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all hero texts (including inactive) - for admin
router.get('/all', async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ order: 1, createdAt: -1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single hero
router.get('/:id', async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ error: 'Hero not found' });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create hero
router.post('/', async (req, res) => {
  try {
    const hero = new Hero(req.body);
    await hero.save();
    res.status(201).json(hero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update hero
router.put('/:id', async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!hero) {
      return res.status(404).json({ error: 'Hero not found' });
    }
    res.json(hero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete hero
router.delete('/:id', async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ error: 'Hero not found' });
    }
    res.json({ message: 'Hero deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

