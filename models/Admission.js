// backend/models/Admission.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admission = sequelize.define("Admission", {
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

module.exports = Admission;
