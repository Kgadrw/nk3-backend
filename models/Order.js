const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    product: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      category: { type: String },
      productId: { type: String }
    },
    quantity: { type: Number, required: true }
  }],
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    country: { type: String }
  },
  paymentMethod: {
    methodId: { type: String },
    methodName: { type: String }
  },
  notes: { type: String },
  subtotal: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

