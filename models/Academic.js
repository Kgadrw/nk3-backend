const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  pdfLink: { type: String, default: '' },
  link: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Academic', academicSchema);

