require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app.js');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
