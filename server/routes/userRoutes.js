const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// ✅ Register User
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, createdAt } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      createdAt,
      isBlocked: false // default as not blocked
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error in /register:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });
    if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ message: 'Login successful', role: user.role, userId: user._id });
  } catch (err) {
    console.error('Error in /login:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error('Error in GET /users:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get Single User
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Update User
router.put('/:id', async (req, res) => {
  const updateFields = { ...req.body };
  delete updateFields.password; // Avoid updating password here

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Delete User
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Block/Unblock User
router.put('/:id/status', async (req, res) => {
  const { isBlocked } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status', error: err.message });
  }
});

// ✅ Impersonate User (Session Switch)
router.get('/impersonate/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simulate session switch (in real world, generate token or session)
    res.status(200).json({
      message: `Switched session to ${user.email}`,
      impersonatedUser: user
    });
  } catch (err) {
    res.status(500).json({ message: 'Error impersonating user', error: err.message });
  }
});

module.exports = router;
