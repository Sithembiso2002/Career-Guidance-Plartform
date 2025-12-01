const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time, COUNT(*) as institution_count FROM institutes');
    res.json({
      success: true,
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;