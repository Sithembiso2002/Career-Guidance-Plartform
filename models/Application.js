// models/Application.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  high_school_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  highest_qualification: {
    type: DataTypes.ENUM('Matric', 'IGCSE/LGCSE', 'A-Level'),
    allowNull: false
  },
  final_results_file: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  passport_photo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  birth_certificate: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  guardian_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  guardian_relationship: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  guardian_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  guardian_occupation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  institute_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'under_review', 'admitted', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'submitted_at',
  updatedAt: 'updated_at'
});

// Add this after model definition
Application.associate = function(models) {
  Application.belongsTo(models.Institute, { foreignKey: 'institution_id' });
  Application.belongsTo(models.Faculty, { foreignKey: 'faculty_id' });
};

module.exports = Application;