const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Faculty = sequelize.define(
  "Faculty",
  {
    faculty_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "faculty_id"
    },
    faculty_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "faculty_name"
    },
    faculty_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "faculty_code"
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    office_location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    specialization: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
      allowNull: false
    },
    // FIXED: Now references the correct primary key
    institute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "institute_id",
      references: {
        model: 'institutes',
        key: 'institute_id' // ✅ CHANGED TO MATCH INSTITUTE MODEL
      }
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
    tableName: "faculties",
    timestamps: true,
    underscored: false
  }
);

// FIXED: Association with correct targetKey
Faculty.associate = function(models) {
  Faculty.hasMany(models.Application, { foreignKey: 'faculty_id' });
  Faculty.belongsTo(models.Institute, { 
    foreignKey: 'institute_id',
    targetKey: 'institute_id' // ✅ ADDED TARGET KEY
  });
};

module.exports = Faculty;