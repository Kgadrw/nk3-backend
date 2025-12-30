const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  category: { type: String, default: 'Uncategorized' },
  image: { type: String, required: true },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);

