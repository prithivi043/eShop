// routes/stats.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Total customers
router.get('/customers', async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'user' });
    res.json({ totalCustomers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer count' });
  }
});

// Total products
router.get('/products', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product count' });
  }
});

module.exports = router;
