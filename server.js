// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
// REMOVE THIS LINE: await sequelize.sync({ force: true });

// Routes
const studentAuthRoutes = require("./routes/studentAuth");
const adminAuthRoutes = require("./routes/adminAuth");
const adminDashboardRoutes = require("./routes/adminDashboard");
const instituteAuthRoutes = require("./routes/instituteAuth");
const userAuthRoutes = require("./routes/userAuth");
const studentRoutes = require("./routes/students");
const institutionRoutes = require("./routes/institution");
const facultyRoutes = require("./routes/faculties");
const courseRoutes = require("./routes/courses");
// Add this with your other route imports
const applicationRoutes = require('./routes/applicationRoutes');
// ADD THIS LINE - Public routes for viewing admissions
const publicRoutes = require('./routes/publicRoutes');
// In server.js, add with other route imports
const institutionPublicRoutes = require('./routes/institutionPublicRoutes');

const app = express();

// ================================
// FIXED CORS CONFIGURATION
// ================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'https://career-guidance-frontend.vercel.app', // Add your Vercel URL here
  'https://career-guidance-frontend-git-*.vercel.app', // For preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      // Handle wildcard subdomains
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend + PostgreSQL Connected Successfully 🚀");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true,
    message: "Server is running", 
    timestamp: new Date().toISOString()
  });
});

// ================================
// AUTH ROUTES
// ================================
console.log("🔄 Mounting auth routes...");
app.use("/auth", userAuthRoutes);
app.use("/auth/students", studentAuthRoutes);
app.use("/auth/institutes", instituteAuthRoutes);
app.use("/auth/admin", adminAuthRoutes);
app.use("/auth/admin", adminDashboardRoutes);

// ================================
// DASHBOARD API ROUTES
// ================================
console.log("🔄 Mounting API routes...");
app.use("/api/students", studentRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/courses", courseRoutes);
console.log("✅ Courses routes mounted at /api/courses");
// Add with other route mounts
app.use("/api/public", institutionPublicRoutes); // ADD THIS LINE
console.log("✅ Institution public routes mounted at /api/public");

app.use("/api", applicationRoutes); // ADD THIS LINE
console.log("✅ Application routes mounted at /api");

// ADD THIS LINE - Public routes for viewing admissions
app.use("/api/public", publicRoutes); // ADD THIS LINE
console.log("✅ Public routes mounted at /api/public");

// Add this after your other middleware (before routes)
app.use('/uploads', express.static('uploads')); // For serving uploaded files

// Add this with your other route mounts
console.log("🔄 Mounting application routes...");

// ================================
// MANUAL ROUTE FOR TESTING PUT
// ================================
console.log("🔄 Adding manual PUT test route...");
app.put("/api/courses/test-put", (req, res) => {
  console.log("✅ Manual PUT route called!");
  res.json({ 
    success: true, 
    message: "Manual PUT route works!",
    body: req.body 
  });
});

app.delete("/api/courses/test-delete", (req, res) => {
  console.log("✅ Manual DELETE route called!");
  res.json({ 
    success: true, 
    message: "Manual DELETE route works!" 
  });
});

// ================================
// ADD CORS TEST ROUTE
// ================================
app.get("/api/test-cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// ================================
// DATABASE CONNECTION - FIXED VERSION
// ================================
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connected Successfully!");
    
    // USE THIS LINE TO RESET DATABASE (run once, then comment out)
    await sequelize.sync({ alter: true });
    console.log("✅ Database Synced (tables recreated)");
    
    // AFTER FIRST RUN, CHANGE TO:
    // await sequelize.sync({ alter: true });
    // console.log("✅ Database Synced (tables auto-created/updated)");
    
  } catch (err) {
    console.error("❌ Database Error:", err);
  }
}

// ================================
// IMPROVED ROUTE LOGGING
// ================================
function printAllRoutes() {
  console.log("\n=== ALL REGISTERED ROUTES ===");
  
  function printRoutes(stack, path = '') {
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(`   ${methods} ${path}${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle.stack) {
        const newPath = path + (layer.regexp.source === '^\\/?$' ? '' : '/...');
        printRoutes(layer.handle.stack, newPath);
      }
    });
  }
  
  printRoutes(app._router.stack);
  console.log("=============================\n");
}

// ================================
// SERVER START
// ================================
const PORT = process.env.PORT || 5000;

async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS Enabled for origins: ${allowedOrigins.join(', ')}`);
    printAllRoutes();
    
    console.log("\n💡 Test these endpoints:");
    console.log("   GET  http://localhost:5000/api/test-cors (Test CORS)");
    console.log("   GET  http://localhost:5000/api/institutions");
    console.log("   PUT  http://localhost:5000/api/courses/test-put");
    console.log("   DELETE http://localhost:5000/api/courses/test-delete");
    console.log("   GET  http://localhost:5000/api/public/admissions (View Admissions)");
    
    console.log("\n📱 Test from browser console:");
    console.log(`   fetch('http://localhost:5000/api/test-cors')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));`);
  });
}

startServer();

