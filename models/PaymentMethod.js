const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'mobile_money', 'bank', 'card', 'other'
  accountName: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  provider: { type: String, default: '' }, // e.g., 'MTN', 'Airtel', 'Bank Name'
  instructions: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);

