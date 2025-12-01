// backend/config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config(); // loads .env automatically

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is undefined. Check your .env file!");
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres", // REQUIRED for Sequelize v4+
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Needed for Render / Cloud DBs
    },
  },
  define: {
    timestamps: true, // Keep models clean if not using timestamps
  },
  logging: false // Log SQL to console if needed by replacing with console.log
});

// Test connection when server starts
sequelize.authenticate()
  .then(() => console.log("✅ Remote PostgreSQL Connected Successfully 🚀"))
  .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = sequelize;
