const express = require('express');
const router = express.Router();
const StatsService = require('../services/StatsService');
const { verifyToken } = require('../middleware/authMiddleware');

// Record a silent page view
router.post('/view', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Asynchronously record to not block the response
  StatsService.recordView(ip, userAgent);
  res.status(200).json({ success: true });
});

// Record user engagement (like a link click)
router.post('/engage', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  const { action } = req.body;
  
  if (action) {
    StatsService.recordEngagement(action, ip);
  }
  
  res.status(200).json({ success: true });
});

// Admin endpoint to read the aggregate data
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const summary = await StatsService.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to get chart data (supports daily, weekly, monthly)
router.get('/chart', verifyToken, async (req, res) => {
  try {
    const { timeframe } = req.query;
    const chart = await StatsService.getChartData(timeframe);
    res.json(chart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to get regional maps
router.get('/regions', verifyToken, async (req, res) => {
  try {
    const regions = await StatsService.getRegionalData();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
