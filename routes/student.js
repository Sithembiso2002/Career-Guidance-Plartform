//backend\routes\student.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/students/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find student by email
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    // 4. Send response
    res.json({
      message: "Login successful",
      token,
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
