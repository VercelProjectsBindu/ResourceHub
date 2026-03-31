const express = require('express');
const router = express.Router();
const SettingsService = require('../services/SettingsService');
const { verifyToken } = require('../middleware/authMiddleware');

// Public route to fetch all global configurations immediately for React Context
router.get('/', async (req, res) => {
  try {
    const settings = await SettingsService.getAll();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve site configurations' });
  }
});

// Protected route to update key-value CMS map globally
router.post('/', verifyToken, async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    
    // Updates the MySQL database values and returns the new master config block
    const updated = await SettingsService.updateAll(settings);
    
    // Attempt tracking
    try {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
      const StatsService = require('../services/StatsService');
      StatsService.recordEngagement('CMS_SETTINGS_UPDATED', ip);
    } catch(e) {}
    
    res.json({ success: true, settings: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
