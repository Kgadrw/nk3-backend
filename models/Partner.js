const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  name: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema);

