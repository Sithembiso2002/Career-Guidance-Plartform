// backend/routes/studentAuth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Student = require("../models/Student");
const Admission = require("../models/Admission"); // your student applications model
const verifyStudentToken = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

// =========================
// Student Signup
// =========================
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, nationality, email, phone, password } = req.body;
    if (!first_name || !last_name || !date_of_birth || !gender || !nationality || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Student.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({
      first_name,
      last_name,
      date_of_birth,
      gender,
      nationality,
      email,
      phone,
      password: hashed
    });

    res.json({ message: "Student registered successfully!", student });

  } catch (err) {
    console.error("Student Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// Student Login
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: student.student_id, email: student.email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({
      token,
      student: {
        id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        role: "student"
      }
    });

  } catch (err) {
    console.error("Student Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// Protected Student Routes
// =========================

// GET student profile
router.get("/profile", verifyStudentToken, async (req, res) => {
  try {
    res.json({ student: req.student });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update student profile
router.put("/profile/:id", verifyStudentToken, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.student.student_id)
      return res.status(403).json({ message: "Forbidden" });

    const { first_name, last_name, email, phone, date_of_birth, gender, nationality } = req.body;

    await req.student.update({ first_name, last_name, email, phone, date_of_birth, gender, nationality });

    res.json({ message: "Profile updated successfully", student: req.student });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET student admissions
router.get("/admissions", verifyStudentToken, async (req, res) => {
  try {
    const applications = await Admission.findAll({
      where: { student_id: req.student.student_id },
    });
    res.json({ admissions: applications });
  } catch (err) {
    console.error("Admissions Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
