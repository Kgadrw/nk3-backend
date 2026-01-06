const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  icon: { type: String, default: 'Building2' }, // Icon name from lucide-react
  order: { type: Number, default: 0 } // For ordering services
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);

