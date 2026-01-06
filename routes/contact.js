const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get contact info
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.getContactInfo();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contact info
router.post('/', async (req, res) => {
  try {
    // Check if contact info already exists
    const existing = await Contact.findOne();
    if (existing) {
      return res.status(400).json({ error: 'Contact info already exists. Use PUT to update.' });
    }
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update contact info
router.put('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact(req.body);
      await contact.save();
    } else {
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        req.body,
        { new: true, runValidators: true }
      );
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete contact info
router.delete('/', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ error: 'Contact info not found' });
    }
    await Contact.findByIdAndDelete(contact._id);
    res.json({ message: 'Contact info deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

