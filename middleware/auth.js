// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

const verifyStudentToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await Student.findByPk(decoded.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    req.student = student;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyStudentToken;
