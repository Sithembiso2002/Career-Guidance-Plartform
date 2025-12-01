const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Institute = require("../models/Institute");

router.get("/dashboard", async (req, res) => {
  try {
    const students = await Student.findAll();
    const institutes = await Institute.findAll();

    return res.json({
      studentsCount: students.length,
      institutionsCount: institutes.length,
      facultiesCount: 0, // Update later when model exists
      coursesCount: 0,   // Update later when model exists
      institutions: institutes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
});

module.exports = router;
