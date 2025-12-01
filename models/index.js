// models/index.js
const sequelize = require('../config/database');
const Institute = require('./Institute');
const Faculty = require('./Faculty');
const Course = require('./Course');
const Student = require('./Student');
const Application = require('./Application'); // Add this line

// Define associations - only define what you actually need
// Remove or comment out associations that aren't being used yet
// Institute.hasMany(Faculty, { foreignKey: 'institute_id' });
// Faculty.belongsTo(Institute, { foreignKey: 'institute_id' });

// Faculty.hasMany(Course, { foreignKey: 'faculty_id' });
// Course.belongsTo(Faculty, { foreignKey: 'faculty_id' });

// Institute.hasMany(Course, { foreignKey: 'institute_id' });
// Course.belongsTo(Institute, { foreignKey: 'institute_id' });

const models = {
  Institute,
  Faculty,
  Course,
  Student,
  Application // Add this line
};

module.exports = {
  sequelize,
  ...models
};