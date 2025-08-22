// controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
  const { name, lastName, email, password, roles } = req.body;
  if (!name || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Admin.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    roles: roles || ['admin'],
  });

  res.status(201).json({ message: "Admin registered successfully" });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({
    message: "Admin logged in successfully",
    token,
    user: {
      id: admin._id,
      name: admin.name,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.roles,
    }
  });
};
