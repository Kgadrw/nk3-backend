const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);

