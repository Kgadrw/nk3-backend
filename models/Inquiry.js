const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  readAt: { type: Date },
  repliedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);

