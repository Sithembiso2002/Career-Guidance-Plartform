const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
console.log("DATABASE_URL =", process.env.DATABASE_URL);
