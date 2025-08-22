const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');

// Register
exports.registerCustomer = async (req, res) => {
  try {
    const { name, lastName, email, password, role } = req.body;
    if (!name || !email || !password || !lastName || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering customer', error });
  }
};

// Login
exports.loginCustomer = async (req, res) => {
  // Add login logic here
};
