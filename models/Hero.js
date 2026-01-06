const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  titlePart1: { type: String, default: '' },
  titlePart2: { type: String, default: '' },
  description: { type: String, default: '' },
  buttonText: { type: String, default: 'Get Started' },
  image: { type: String, default: '' }, // Optional - frontend can fallback to a default image
  buttonLink: { type: String, default: '/contact' }, // Target page for CTA button
  order: { type: Number, default: 0 }, // For ordering multiple hero texts
  isActive: { type: Boolean, default: true } // To enable/disable specific hero texts
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);

