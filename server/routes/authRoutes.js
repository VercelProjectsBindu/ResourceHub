const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const sqlDB = require('../services/sqlDB');

const authService = new AuthService(sqlDB);

// Register
router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    const status = (error.message.includes('exists') || error.message.includes('registered')) ? 409 : 400;
    res.status(status).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('username:', req.body.username);
  console.log('password:', req.body.password);
  try {
    const { username, password } = req.body;
    const { token, user } = await authService.login(username, password);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout (Client side should clear token, but we provide this for API consistency)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
