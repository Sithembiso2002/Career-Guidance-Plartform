//backend\models\Institute.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Institute = sequelize.define(
  "Institute",
  {
    institute_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "institute_id"
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    type: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    address: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    contact: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password: { 
      type: DataTypes.STRING 
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
    tableName: "institutes",
    timestamps: true,
    underscored: false
  }
);

// Updated associations
Institute.associate = function(models) {
  Institute.hasMany(models.Application, { foreignKey: 'institution_id' });
  Institute.hasMany(models.Faculty, { 
    foreignKey: 'institute_id',
    sourceKey: 'institute_id' // ✅ ADDED THIS LINE
  });
};

module.exports = Institute;



{/*//backend\models\Institute.js


const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Institute = sequelize.define(
  "Institute",
  {
    institute_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING }, // optional if you add login
  },
  {
    tableName: "institutes",
    timestamps: true,
  }
);

module.exports = Institute;
*/}