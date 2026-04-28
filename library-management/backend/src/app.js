const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const movieRoutes = require('./routes/movies');
const membershipRoutes = require('./routes/memberships');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', authMiddleware, bookRoutes); 
app.use('/api/movies', authMiddleware, movieRoutes);
app.use('/api/memberships', authMiddleware, membershipRoutes); 
app.use('/api/transactions', authMiddleware, transactionRoutes); 
app.use('/api/users', authMiddleware, userRoutes);

app.get('/', (req, res) => {
  res.send('Library Management Backend API is running with Security Middleware.');
});

module.exports = app;
