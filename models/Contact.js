const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // Phone numbers array
  phoneNumbers: [{
    type: String,
    default: []
  }],
  // Email
  email: { type: String, default: 'info@nk3darchitecture.com' },
  // Address
  address: { type: String, default: 'Kigali, Rwanda' },
  // Website
  website: { type: String, default: 'www.nk3dstudio.rw' },
  // Business hours (optional)
  businessHours: {
    weekdays: { type: String, default: '8:00 AM - 5:00 PM' },
    saturday: { type: String, default: '9:00 AM - 1:00 PM' },
    sunday: { type: String, default: 'Closed' }
  }
}, {
  timestamps: true
});

// Static method to get or create contact info
contactSchema.statics.getContactInfo = async function() {
  let contact = await this.findOne();
  if (!contact) {
    contact = new this({
      phoneNumbers: ['+(250) 783 206 660', '+250 789 140 125'],
      email: 'info@nk3darchitecture.com',
      address: 'Kigali, Rwanda',
      website: 'www.nk3dstudio.rw'
    });
    await contact.save();
  }
  return contact;
};

module.exports = mongoose.model('Contact', contactSchema);

