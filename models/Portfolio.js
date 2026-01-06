const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  area: { type: String, default: '' },
  client: { type: String, default: '' },
  status: { type: String, default: 'Completed' },
  keyFeatures: { type: String, default: '' },
  designTeam: { type: [String], default: [] },
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);

