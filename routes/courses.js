// backend/routes/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all courses...');
    const courses = await Course.findAll({
      order: [['course_id', 'ASC']]
    });
    
    console.log(`Found ${courses.length} courses`);
    
    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message
    });
  }
});

// GET course by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching course with ID: ${id}`);
    
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message
    });
  }
});

// POST create course
router.post("/", async (req, res) => {
  try {
    console.log('Creating course:', req.body);
    
    const { course_name, course_code, description, credits, duration, faculty_id, institute_id, status } = req.body;
    
    // Validate required fields
    if (!course_name || !course_code || !faculty_id || !institute_id) {
      return res.status(400).json({
        success: false,
        message: "Course name, code, faculty ID, and institute ID are required"
      });
    }

    const course = await Course.create({
      course_name,
      course_code,
      description,
      credits: credits || 3,
      duration: duration || '3 months',
      faculty_id,
      institute_id,
      status: status || 'Active'
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.errors.map(e => e.message).join(', ')
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Course code already exists"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message
    });
  }
});

// PUT update course - FIXED: Make sure this endpoint exists
// PUT update course - THIS MUST EXIST
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 PUT /api/courses/${id} called with:`, req.body);
    
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const { course_name, course_code, description, credits, duration, faculty_id, institute_id, status } = req.body;
    
    if (!course_name || !course_code || !faculty_id || !institute_id) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    await course.update({
      course_name, course_code, description, credits, duration, faculty_id, institute_id, status
    });
    
    console.log(`✅ Course ${id} updated successfully`);
    res.json({ success: true, message: "Course updated successfully", data: course });
    
  } catch (error) {
    console.error('❌ Error updating course:', error);
    res.status(500).json({ success: false, message: "Error updating course", error: error.message });
  }
});

// DELETE course - FIXED: Make sure this endpoint exists
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting course ID: ${id}`);
    
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    await course.destroy();
    
    console.log(`✅ Course ${id} deleted successfully`);
    
    res.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error('❌ Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message
    });
  }
});

module.exports = router;