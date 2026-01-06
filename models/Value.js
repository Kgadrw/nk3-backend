const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 } // For ordering values
}, {
  timestamps: true
});

module.exports = mongoose.model('Value', valueSchema);

