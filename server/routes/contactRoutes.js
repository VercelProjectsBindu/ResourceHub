const express = require('express');
const router = express.Router();
const SQLCRUDService = require('../services/SQLCRUDService');
const sqlDB = require('../services/sqlDB');
const { verifyToken } = require('../middleware/authMiddleware');

const contactService = new SQLCRUDService('contacts', sqlDB);

// Get all contact messages
router.get('/', verifyToken, async (req, res) => {
  try {
    const messages = await contactService.getAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a contact message
router.post('/', async (req, res) => {
  try {
    const newMessage = await contactService.create(req.body);
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
