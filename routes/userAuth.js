//backend\routes\userAuth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Student = require("../models/Student");
const Institute = require("../models/Institute");

const JWT_SECRET = process.env.JWT_SECRET || "yourfallbacksecret";

// --- STUDENT REGISTER ---
router.post("/student/register", async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, nationality, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({ ...req.body, password: hashedPassword });

    res.json({ message: "Student registered successfully", student });
  } catch (err) {
    console.error("Student registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- INSTITUTE REGISTER ---
router.post("/institute/register", async (req, res) => {
  try {
    const { name, type, address, contact, email } = req.body;

    if (!name || !type || !address || !contact || !email) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingInstitute = await Institute.findOne({ where: { email } });
    if (existingInstitute) return res.status(400).json({ message: "Institute already exists" });

    const institute = await Institute.create(req.body);

    res.json({ message: "Institute registered successfully", institute });
  } catch (err) {
    console.error("Institute registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- USER LOGIN (STUDENT OR INSTITUTE) ---
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check student first
    let user = await Student.findOne({ where: { email } });
    let role = "student";

    if (!user) {
      // Check institute
      user = await Institute.findOne({ where: { email } });
      role = "institute";

      if (!user) return res.status(400).json({ message: "User not found" });
    }

    // Students have password, institutes might not
    if (role === "student") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user[`${role}_id`], email: user.email, role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user[`${role}_id`], role, ...user.dataValues },
    });

  } catch (err) {
    console.error("User login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
