const express = require('express');
const router = express.Router();
const sqlDB = require('../services/sqlDB');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const logs = await sqlDB.query(`
      SELECT * FROM activity_logs 
      ORDER BY created_at DESC 
      LIMIT 100
    `);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
