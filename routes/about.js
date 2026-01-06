const express = require('express');
const router = express.Router();
const About = require('../models/About');

// Get about content
router.get('/', async (req, res) => {
  try {
    const about = await About.getAboutContent();
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create about content
router.post('/', async (req, res) => {
  try {
    // Check if about content already exists
    const existing = await About.findOne();
    if (existing) {
      return res.status(400).json({ error: 'About content already exists. Use PUT to update.' });
    }
    const about = new About(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update about content
router.put('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About(req.body);
      await about.save();
    } else {
      about = await About.findByIdAndUpdate(
        about._id,
        req.body,
        { new: true, runValidators: true }
      );
    }
    res.json(about);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete about content
router.delete('/', async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ error: 'About content not found' });
    }
    await About.findByIdAndDelete(about._id);
    res.json({ message: 'About content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

