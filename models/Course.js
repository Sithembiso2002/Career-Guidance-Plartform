//backend\models\Course.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
  "Course",
  {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "course_id"
    },
    course_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "course_name"
    },
    course_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "course_code"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '3 months'
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'faculties',
        key: 'faculty_id'
      },
      field: "faculty_id"
    },
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'institutes',
        key: 'institute_id'
      },
      field: "institute_id"
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "createdAt"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updatedAt"
    }
  },
  {
    tableName: "courses",
    timestamps: true,
    underscored: false
  }
);

module.exports = Course;