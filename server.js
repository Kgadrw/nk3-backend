const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'NK 3D Architecture Studio Dashboard API' });
});

// API Routes
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/team', require('./routes/team'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/social', require('./routes/social'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/about', require('./routes/about'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/order', require('./routes/order'));
app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/services', require('./routes/services'));
app.use('/api/values', require('./routes/values'));

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

