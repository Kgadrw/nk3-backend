const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  // About Page Content
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  quote: { type: String, default: '' },
  paragraph1: { type: String, default: '' },
  paragraph2: { type: String, default: '' },
  paragraph3: { type: String, default: '' },
  aboutImage: { type: String, default: '' },
  
  // Homepage About Component Content
  homeHeading: { type: String, default: '' },
  homeSubheading: { type: String, default: '' },
  homeSince: { type: String, default: '' },
  homeDescription1: { type: String, default: '' },
  homeDescription2: { type: String, default: '' },
  homeImage: { type: String, default: '' },
  
  // Statistics
  projectsCount: { type: String, default: '' },
  clientsCount: { type: String, default: '' },
  yearsCount: { type: String, default: '' },
}, {
  timestamps: true
});

// Static method to get about content (don't auto-create)
aboutSchema.statics.getAboutContent = async function() {
  const about = await this.findOne();
  // Return empty object if no document exists, don't create one
  return about || {};
};

module.exports = mongoose.model('About', aboutSchema);

