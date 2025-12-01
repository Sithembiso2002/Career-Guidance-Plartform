// backend/routes/faculties.js
const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");

// GET all faculties
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all faculties...');
    const faculties = await Faculty.findAll({
      order: [['faculty_id', 'ASC']]
    });
    
    console.log(`Found ${faculties.length} faculties`);
    
    res.json({
      success: true,
      data: faculties,
      count: faculties.length
    });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculties",
      error: error.message
    });
  }
});

// GET faculty by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching faculty with ID: ${id}`);
    
    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }
    
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty",
      error: error.message
    });
  }
});

// POST create faculty
router.post("/", async (req, res) => {
  try {
    console.log('Creating faculty:', req.body);
    
    const { faculty_name, faculty_code, department, email, phone, office_location, specialization, status, institute_id } = req.body;
    
    // Validate required fields
    if (!faculty_name || !faculty_code || !department || !email || !institute_id) {
      return res.status(400).json({
        success: false,
        message: "Faculty name, code, department, email, and institute are required"
      });
    }

    const faculty = await Faculty.create({
      faculty_name,
      faculty_code,
      department,
      email,
      phone,
      office_location,
      specialization,
      status: status || 'Active',
      institute_id: parseInt(institute_id, 10)
    });

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: faculty
    });
  } catch (error) {
    console.error('Error creating faculty:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.errors.map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Faculty code or email already exists"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating faculty",
      error: error.message
    });
  }
});

// PUT update faculty
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating faculty ID: ${id}`, req.body);
    
    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }

    // Handle institute_id conversion if provided
    const updateData = { ...req.body };
    if (updateData.institute_id) {
      updateData.institute_id = parseInt(updateData.institute_id, 10);
    }

    await faculty.update(updateData);
    
    res.json({
      success: true,
      message: "Faculty updated successfully",
      data: faculty
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.errors.map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Faculty code or email already exists"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error updating faculty",
      error: error.message
    });
  }
});

// DELETE faculty
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting faculty ID: ${id}`);
    
    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }

    await faculty.destroy();
    
    res.json({
      success: true,
      message: "Faculty deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting faculty",
      error: error.message
    });
  }
});

module.exports = router;