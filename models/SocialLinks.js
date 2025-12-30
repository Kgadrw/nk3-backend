const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  instagram: { type: String, default: '' },
  companyProfilePdf: { type: String, default: '' },
}, {
  timestamps: true
});

// Only one document should exist
socialLinksSchema.statics.getSocialLinks = async function() {
  let links = await this.findOne();
  if (!links) {
    links = await this.create({});
  }
  return links;
};

module.exports = mongoose.model('SocialLinks', socialLinksSchema);

