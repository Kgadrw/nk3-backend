const express = require('express');
const router = express.Router();
const About = require('../models/About');

// Get about content
router.get('/', async (req, res) => {
  try {
    const about = await About.getAboutContent();
    // Filter out empty string values and only return fields that have actual content
    const filteredAbout = {};
    if (about && Object.keys(about).length > 0 && about._id) {
      // Only process if it's a real document (has _id), not an empty object
      // List of content fields to check
      const contentFields = ['title', 'subtitle', 'quote', 'paragraph1', 'paragraph2', 'paragraph3', 
                            'aboutImage', 'description', 'homeHeading', 'homeSubheading', 'homeSince', 
                            'homeDescription1', 'homeDescription2', 'homeImage', 'aim',
                            'description1', 'description2', 'projectsCount', 'clientsCount', 'yearsCount'];
      
      Object.keys(about).forEach(key => {
        // Skip MongoDB internal fields
        if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
          const value = about[key];
          // Only include if it's a non-empty string
          if (typeof value === 'string' && value.trim() !== '') {
            filteredAbout[key] = value;
          }
        }
      });
      
      // Check if any content fields have actual values
      const hasContent = contentFields.some(field => 
        filteredAbout[field] && filteredAbout[field].trim() !== ''
      );
      
      // If no content fields have values, return empty object
      if (!hasContent) {
        return res.json({});
      }
    }
    res.json(Object.keys(filteredAbout).length > 0 ? filteredAbout : {});
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
      // Create new document if none exists
      about = new About(req.body);
      await about.save();
      console.log('Created new about document:', about);
    } else {
      // Update existing document
      about = await About.findByIdAndUpdate(
        about._id,
        req.body,
        { new: true, runValidators: true }
      );
      console.log('Updated about document:', about);
    }
    res.json(about);
  } catch (error) {
    console.error('Error updating about content:', error);
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

