const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// make uploaded images available at http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// errors (for example: wrong file type or file too large)
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

module.exports = app;
