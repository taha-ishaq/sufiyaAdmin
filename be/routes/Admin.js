const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Create Admin route
router.post('/create', async (req, res) => {
  const { username, password } = req.body;

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.status(400).send('Admin already exists.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new admin
  const admin = new Admin({
    username,
    password: hashedPassword,
  });

  try {
    await admin.save();
    res.status(201).send('Admin created successfully.');
  } catch (error) {
    res.status(500).send('Error creating admin: ' + error.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(400).send('Invalid credentials.');
  }

  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Route to check admin access
router.get('/check', (req, res) => {
  res.send('Admin access granted.');
});

module.exports = router;
