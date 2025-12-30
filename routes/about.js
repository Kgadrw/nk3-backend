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

module.exports = router;

