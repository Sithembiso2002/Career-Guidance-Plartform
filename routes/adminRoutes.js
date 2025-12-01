// backend/routes/adminRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Institute = require("../models/Institute");
const Student = require("../models/Student");
require("dotenv").config();

const router = express.Router();

// ------------------------
// Middleware: verify admin token
// ------------------------
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------------
// Admin Signup
// ------------------------
router.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashedPassword });
    res.json({ message: "Admin registered successfully", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// Admin Login
// ------------------------
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: admin.admin_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------
// Fetch Dashboard Data
// ------------------------
router.get("/admin/dashboard", verifyAdminToken, async (req, res) => {
  try {
    const institutions = await Institute.findAll();
    const studentsCount = await Student.count();
    const facultiesCount = 0; // Add if you have faculties table
    const coursesCount = 0;   // Add if you have courses table

    res.json({ institutions, studentsCount, facultiesCount, coursesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

// ------------------------
// Add New Institution
// ------------------------
router.post("/admin/institutions", verifyAdminToken, async (req, res) => {
  try {
    const { name, type, address, contact, email, password } = req.body;

    const existing = await Institute.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const institute = await Institute.create({ name, type, address, contact, email, password });
    res.status(201).json({ message: "Institute added successfully", institute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add institute" });
  }
});

// ------------------------
// Update Institution
// ------------------------
router.put("/admin/institutions/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, address, contact, email, password } = req.body;

    const institute = await Institute.findByPk(id);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    await institute.update({ name, type, address, contact, email, password });
    res.json({ message: "Institute updated successfully", institute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update institute" });
  }
});

// ------------------------
// Delete Institution
// ------------------------
router.delete("/admin/institutions/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await Institute.findByPk(id);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    await institute.destroy();
    res.json({ message: "Institute deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete institute" });
  }
});

module.exports = router;
