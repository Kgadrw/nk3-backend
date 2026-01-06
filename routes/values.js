const express = require('express');
const router = express.Router();
const Value = require('../models/Value');

// Get all values
router.get('/', async (req, res) => {
  try {
    const values = await Value.find().sort({ order: 1, createdAt: -1 });
    res.json(values);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single value
router.get('/:id', async (req, res) => {
  try {
    const value = await Value.findById(req.params.id);
    if (!value) {
      return res.status(404).json({ error: 'Value not found' });
    }
    res.json(value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create value
router.post('/', async (req, res) => {
  try {
    const value = new Value(req.body);
    await value.save();
    res.status(201).json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update value
router.put('/:id', async (req, res) => {
  try {
    const value = await Value.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!value) {
      return res.status(404).json({ error: 'Value not found' });
    }
    res.json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete value
router.delete('/:id', async (req, res) => {
  try {
    const value = await Value.findByIdAndDelete(req.params.id);
    if (!value) {
      return res.status(404).json({ error: 'Value not found' });
    }
    res.json({ message: 'Value deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

