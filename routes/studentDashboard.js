// backend/routes/studentDashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Protected route: only logged-in students
router.get('/', auth, async (req, res) => {
  try {
    const studentId = req.user.id; // from token
    const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [studentId]);

    if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
