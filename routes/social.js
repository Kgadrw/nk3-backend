const express = require('express');
const router = express.Router();
const SocialLinks = require('../models/SocialLinks');

// Get social links
router.get('/', async (req, res) => {
  try {
    const links = await SocialLinks.getSocialLinks();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update social links
router.put('/', async (req, res) => {
  try {
    let links = await SocialLinks.findOne();
    if (!links) {
      links = new SocialLinks(req.body);
      await links.save();
    } else {
      links = await SocialLinks.findByIdAndUpdate(
        links._id,
        req.body,
        { new: true, runValidators: true }
      );
    }
    res.json(links);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

