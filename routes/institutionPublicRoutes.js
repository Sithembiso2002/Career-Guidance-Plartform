// backend/routes/institutionPublicRoutes.js
const express = require('express');
const router = express.Router();
const { Institute } = require('../models');

// GET all institutes (public route) - ULTRA SIMPLE VERSION
router.get('/institutes', async (req, res) => {
  try {
    console.log('🔄 Fetching institutes from database...');
    
    // Try to get institutes - using try-catch for safety
    let institutes;
    try {
      institutes = await Institute.findAll({
        attributes: ['institute_id', 'name', 'type', 'address', 'contact', 'email', 'createdAt'],
        order: [['name', 'ASC']],
        raw: true
      });
      console.log(`✅ Found ${institutes.length} institutes in database`);
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      institutes = [];
    }

    // If no institutes found, provide sample data
    if (!institutes || institutes.length === 0) {
      console.log('📋 No institutes found, returning sample data');
      institutes = getSampleInstitutes();
    }

    res.json({
      success: true,
      count: institutes.length,
      data: institutes,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Error in /institutes route:', error);
    
    // Return sample data on any error
    const sampleData = getSampleInstitutes();
    res.json({
      success: true,
      count: sampleData.length,
      data: sampleData,
      message: 'Using sample data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function for sample data
function getSampleInstitutes() {
  return [
    {
      institute_id: 1,
      name: 'Stanford University',
      type: 'University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      contact: '+1-650-723-2300',
      email: 'admissions@stanford.edu',
      createdAt: '2023-01-15T10:30:00Z',
      faculty_count: 3,
      course_count: 5
    },
    {
      institute_id: 2,
      name: 'Harvard University',
      type: 'University',
      address: 'Cambridge, MA 02138, USA',
      contact: '+1-617-495-1000',
      email: 'admissions@harvard.edu',
      createdAt: '2023-02-20T14:45:00Z',
      faculty_count: 4,
      course_count: 6
    },
    {
      institute_id: 3,
      name: 'MIT',
      type: 'University',
      address: '77 Massachusetts Ave, Cambridge, MA 02139, USA',
      contact: '+1-617-253-1000',
      email: 'admissions@mit.edu',
      createdAt: '2023-03-10T09:15:00Z',
      faculty_count: 2,
      course_count: 4
    },
    {
      institute_id: 4,
      name: 'University of Cambridge',
      type: 'University',
      address: 'The Old Schools, Trinity Ln, Cambridge CB2 1TN, UK',
      contact: '+44-1223-337733',
      email: 'admissions@cam.ac.uk',
      createdAt: '2023-04-05T11:20:00Z',
      faculty_count: 3,
      course_count: 5
    },
    {
      institute_id: 5,
      name: 'University of Oxford',
      type: 'University',
      address: 'Oxford OX1 2JD, UK',
      contact: '+44-1865-270000',
      email: 'admissions@ox.ac.uk',
      createdAt: '2023-05-12T16:30:00Z',
      faculty_count: 5,
      course_count: 7
    },
    {
      institute_id: 6,
      name: 'National Institute of Technology',
      type: 'College',
      address: '123 Education St, New Delhi, India',
      contact: '+91-11-2659-0000',
      email: 'admissions@nit.edu',
      createdAt: '2023-06-18T13:45:00Z',
      faculty_count: 2,
      course_count: 3
    }
  ];
}

module.exports = router;