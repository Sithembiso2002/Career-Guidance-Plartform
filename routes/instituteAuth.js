
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Institute = require("../models/Institute");

const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

// Institute Login
router.post("/login", async (req, res) => {
  try {
    console.log("=== INSTITUTE LOGIN ATTEMPT ===");
    console.log("Request body:", req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log("Looking for institute with email:", email);
    
    const inst = await Institute.findOne({ where: { email } });
    
    if (!inst) {
      console.log("Institute not found for email:", email);
      return res.status(400).json({ message: "Institute not found" });
    }

    console.log("Institute found:", {
      id: inst.institute_id,
      name: inst.name,
      email: inst.email
    });

    // Use direct password comparison (plain text)
    console.log("Using direct password comparison");
    
    const isMatch = password === inst.password;

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Invalid password for institute:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("Login successful, generating token...");
    
    const token = jwt.sign({ id: inst.institute_id, email: inst.email }, JWT_SECRET, { expiresIn: "1d" });
    
    console.log("Login successful for institute:", inst.name);
    
    res.json({ 
      token, 
      institute: { 
        id: inst.institute_id, 
        name: inst.name, 
        email: inst.email,
        type: inst.type 
      } 
    });
    
  } catch (err) {
    console.error("❌ INSTITUTE LOGIN ERROR:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Institute Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("=== INSTITUTE SIGNUP ATTEMPT ===");
    console.log("Request body:", req.body);
    
    const { name, type, address, contact, email, password } = req.body;
    if (!name || !type || !address || !contact || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Checking for existing institute with email:", email);
    
    const existing = await Institute.findOne({ where: { email } });
    if (existing) {
      console.log("Institute already exists with email:", email);
      return res.status(400).json({ message: "Institute already exists" });
    }

    console.log("Creating new institute...");
    
    // Store password as plain text
    const institute = await Institute.create({ name, type, address, contact, email, password });
    
    console.log("Institute created successfully:", institute.institute_id);
    
    res.json({ message: "Institute registered successfully!", institute });
  } catch (err) {
    console.error("❌ INSTITUTE SIGNUP ERROR:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;