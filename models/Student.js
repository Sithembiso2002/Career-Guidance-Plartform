//backend\models\Student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'student_id'
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'first_name'
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'last_name'
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'createdAt',
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updatedAt',
    allowNull: false
  }
}, {
  tableName: 'students',
  timestamps: true,
  underscored: false
});

module.exports = Student;



