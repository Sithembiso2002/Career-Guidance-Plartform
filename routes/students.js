//backend\routes\students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Student login attempt for:', email);
    
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(400).json({ 
        success: false,
        message: "Student not found" 
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { 
        id: student.student_id, 
        email: student.email,
        type: 'student'
      },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
      },
    });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// Get all students (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all students for admin...');
    const students = await Student.findAll({
      order: [['student_id', 'ASC']],
      attributes: { exclude: ['password'] }
    });
    console.log(`Found ${students.length} students`);
    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching student with ID: ${id}`);
    const student = await Student.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }
    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Add a new student
router.post("/", async (req, res) => {
  try {
    console.log('Creating new student:', req.body);
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Update a student
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating student ID: ${id}`, req.body);
    
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }

    await student.update(req.body);
    
    res.json({
      success: true,
      message: "Student updated successfully",
      data: student
    });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting student ID: ${id}`);
    
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }

    await student.destroy();
    
    res.json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;



