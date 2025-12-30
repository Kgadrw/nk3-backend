const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  // About Page Content
  title: { type: String, default: 'Our Story, Vision, and Values' },
  subtitle: { type: String, default: 'Learn about our commitment to excellence, innovation, and the principles that guide our work every day.' },
  quote: { type: String, default: 'We are dedicated to bringing your visions to life, transforming ideas into impactful architectural experiences. Our team combines creativity, technical expertise, and a deep understanding of local context to deliver projects that exceed expectations.' },
  paragraph1: { type: String, default: 'We believe in the power of collaboration and creativity. Every project we undertake is a partnership, where we work closely with our clients to understand their unique needs, challenges, and aspirations.' },
  paragraph2: { type: String, default: 'Our approach is holistic, combining design excellence, technical innovation, and strategic thinking. We don\'t just create buildings; we craft environments that inspire, function seamlessly, and stand the test of time.' },
  paragraph3: { type: String, default: 'We stay ahead of industry trends, continuously learning and adapting to bring the latest innovations in architecture, engineering, and sustainable design to every project. Our commitment to quality and excellence has made us a trusted partner in Rwanda\'s construction industry.' },
  aboutImage: { type: String, default: '' },
  
  // Homepage About Component Content
  homeHeading: { type: String, default: 'ABOUT US' },
  homeSubheading: { type: String, default: 'NK 3D ARCHITECTURE STUDIO.' },
  homeSince: { type: String, default: 'we are here since 2016' },
  homeDescription1: { type: String, default: 'We are a design and construction consultancy company established in 2016, specializing in planning, design and management of architectural, engineering and interior design projects practicing in Kigali Rwanda.' },
  homeDescription2: { type: String, default: 'The firm has a skilled team consisting of architects, engineers, quantity surveyors, technicians, designers, specialist consultants and support staff that are able to offer quality consultancy services on all types of construction work.' },
  homeImage: { type: String, default: '' },
  
  // Statistics
  projectsCount: { type: String, default: '100+' },
  clientsCount: { type: String, default: '50+' },
  yearsCount: { type: String, default: '010' },
}, {
  timestamps: true
});

// Static method to get or create about content
aboutSchema.statics.getAboutContent = async function() {
  let about = await this.findOne();
  if (!about) {
    about = new this({});
    await about.save();
  }
  return about;
};

module.exports = mongoose.model('About', aboutSchema);

