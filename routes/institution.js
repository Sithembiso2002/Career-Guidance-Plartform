const express = require("express");
const router = express.Router();
const Institute = require("../models/Institute"); // Fixed import

// GET all institutions
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all institutions...');
    const institutions = await Institute.findAll({
      order: [['institute_id', 'ASC']]
    });
    console.log(`Found ${institutions.length} institutions`);
    res.json({
      success: true,
      data: institutions,
      count: institutions.length
    });
  } catch (err) {
    console.error("Error fetching institutions:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// GET institution by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching institution with ID: ${id}`);
    const institution = await Institute.findByPk(id);
    if (!institution) {
      return res.status(404).json({ 
        success: false,
        message: "Institution not found" 
      });
    }
    res.json({
      success: true,
      data: institution
    });
  } catch (err) {
    console.error("Error fetching institution:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// POST create institution
router.post("/", async (req, res) => {
  try {
    console.log('Creating new institution:', req.body);
    const institution = await Institute.create(req.body);
    res.status(201).json({
      success: true,
      message: "Institution created successfully",
      data: institution
    });
  } catch (err) {
    console.error("Error creating institution:", err);
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists" 
      });
    }
    
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// PUT update institution
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating institution ID: ${id}`, req.body);
    
    const institution = await Institute.findByPk(id);
    if (!institution) {
      return res.status(404).json({ 
        success: false,
        message: "Institution not found" 
      });
    }
    
    await institution.update(req.body);
    
    res.json({
      success: true,
      message: "Institution updated successfully",
      data: institution
    });
  } catch (err) {
    console.error("Error updating institution:", err);
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists" 
      });
    }
    
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// DELETE institution
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting institution ID: ${id}`);
    
    const institution = await Institute.findByPk(id);
    if (!institution) {
      return res.status(404).json({ 
        success: false,
        message: "Institution not found" 
      });
    }
    
    await institution.destroy();
    
    res.json({
      success: true,
      message: "Institution deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting institution:", err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;


