// routes/publicRoutes.js (Updated for filtering)
const express = require('express');
const router = express.Router();
const { Application, Institute, Faculty } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET admissions list with filtering
router.get('/admissions', async (req, res) => {
  try {
    const { 
      status, 
      institution, 
      faculty, 
      search,
      year,
      month 
    } = req.query;
    
    console.log('Fetching admissions with filters:', req.query);
    
    let whereClause = {
      status: ['admitted', 'waitlisted']
    };
    
    // Apply filters if provided
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (institution && institution !== 'all') {
      whereClause.institution_id = institution;
    }
    
    if (faculty && faculty !== 'all') {
      whereClause.faculty_id = faculty;
    }
    
    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { course_name: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const applications = await Application.findAll({
      where: whereClause,
      attributes: [
        'id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'nationality',
        'email',
        'phone',
        'high_school_name',
        'highest_qualification',
        'final_results_file',
        'passport_photo',
        'birth_certificate',
        'guardian_name',
        'guardian_relationship',
        'guardian_phone',
        'guardian_occupation',
        'institution_id',
        'faculty_id',
        'course_name',
        'status',
        'submitted_at',
        'updated_at'
      ],
      include: [
        {
          model: Institute,
          attributes: ['id', 'name', 'location', 'type']
        },
        {
          model: Faculty,
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [['submitted_at', 'DESC']]
    });

    // Get statistics
    const total = applications.length;
    const admitted = applications.filter(app => app.status === 'admitted').length;
    const waitlisted = applications.filter(app => app.status === 'waitlisted').length;
    
    // Get unique institutions and faculties for filters
    const institutions = await Institute.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    
    const faculties = await Faculty.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    console.log(`Found ${applications.length} applications`);
    
    res.json({
      success: true,
      count: applications.length,
      statistics: {
        total,
        admitted,
        waitlisted,
        admissionRate: total > 0 ? ((admitted / total) * 100).toFixed(1) : 0
      },
      filters: {
        institutions,
        faculties
      },
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// Sample data endpoint for testing
router.get('/admissions/sample', async (req, res) => {
  try {
    const sampleData = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Smith',
        date_of_birth: '2002-05-15',
        gender: 'Male',
        nationality: 'American',
        email: 'john.smith@example.com',
        phone: '+1-555-1234',
        high_school_name: 'Lincoln High School',
        highest_qualification: 'A-Level',
        course_name: 'Computer Science',
        status: 'admitted',
        submitted_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        Institute: {
          id: 1,
          name: 'Stanford University',
          location: 'California, USA',
          type: 'University'
        },
        Faculty: {
          id: 1,
          name: 'Engineering',
          description: 'Faculty of Engineering and Technology'
        },
        guardian_name: 'Robert Smith',
        guardian_relationship: 'Father',
        guardian_phone: '+1-555-5678',
        guardian_occupation: 'Engineer'
      },
      {
        id: 2,
        first_name: 'Emma',
        last_name: 'Johnson',
        date_of_birth: '2003-08-22',
        gender: 'Female',
        nationality: 'British',
        email: 'emma.johnson@example.com',
        phone: '+44-7911-123456',
        high_school_name: 'Oxford High School',
        highest_qualification: 'IGCSE/LGCSE',
        course_name: 'Medicine',
        status: 'waitlisted',
        submitted_at: '2024-01-18T09:15:00Z',
        updated_at: '2024-01-22T11:20:00Z',
        Institute: {
          id: 2,
          name: 'Harvard University',
          location: 'Massachusetts, USA',
          type: 'University'
        },
        Faculty: {
          id: 2,
          name: 'Medical Sciences',
          description: 'Faculty of Medical and Health Sciences'
        },
        guardian_name: 'Sarah Johnson',
        guardian_relationship: 'Mother',
        guardian_phone: '+44-7911-987654',
        guardian_occupation: 'Doctor'
      },
      {
        id: 3,
        first_name: 'David',
        last_name: 'Chen',
        date_of_birth: '2001-11-30',
        gender: 'Male',
        nationality: 'Chinese',
        email: 'david.chen@example.com',
        phone: '+86-138-0013-8000',
        high_school_name: 'Beijing High School',
        highest_qualification: 'A-Level',
        course_name: 'Business Administration',
        status: 'admitted',
        submitted_at: '2024-01-10T14:20:00Z',
        updated_at: '2024-01-25T16:30:00Z',
        Institute: {
          id: 3,
          name: 'MIT',
          location: 'Massachusetts, USA',
          type: 'University'
        },
        Faculty: {
          id: 3,
          name: 'Business',
          description: 'Faculty of Business and Management'
        },
        guardian_name: 'Wei Chen',
        guardian_relationship: 'Father',
        guardian_phone: '+86-139-0013-8001',
        guardian_occupation: 'Business Owner'
      },
      {
        id: 4,
        first_name: 'Sophia',
        last_name: 'Williams',
        date_of_birth: '2002-03-08',
        gender: 'Female',
        nationality: 'Canadian',
        email: 'sophia.williams@example.com',
        phone: '+1-416-555-7890',
        high_school_name: 'Toronto High School',
        highest_qualification: 'JC',
        course_name: 'Law',
        status: 'admitted',
        submitted_at: '2024-01-22T11:45:00Z',
        updated_at: '2024-01-28T09:15:00Z',
        Institute: {
          id: 4,
          name: 'University of Cambridge',
          location: 'Cambridge, UK',
          type: 'University'
        },
        Faculty: {
          id: 4,
          name: 'Law',
          description: 'Faculty of Law and Justice'
        },
        guardian_name: 'Michael Williams',
        guardian_relationship: 'Father',
        guardian_phone: '+1-416-555-7891',
        guardian_occupation: 'Professor'
      },
      {
        id: 5,
        first_name: 'Ahmed',
        last_name: 'Ali',
        date_of_birth: '2003-07-19',
        gender: 'Male',
        nationality: 'Egyptian',
        email: 'ahmed.ali@example.com',
        phone: '+20-100-1234-567',
        high_school_name: 'Cairo International School',
        highest_qualification: 'IGCSE/LGCSE',
        course_name: 'Architecture',
        status: 'waitlisted',
        submitted_at: '2024-01-25T13:30:00Z',
        updated_at: '2024-01-29T10:45:00Z',
        Institute: {
          id: 5,
          name: 'University of Oxford',
          location: 'Oxford, UK',
          type: 'University'
        },
        Faculty: {
          id: 5,
          name: 'Architecture',
          description: 'Faculty of Architecture and Design'
        },
        guardian_name: 'Mohammed Ali',
        guardian_relationship: 'Father',
        guardian_phone: '+20-100-9876-543',
        guardian_occupation: 'Architect'
      },
      {
        id: 6,
        first_name: 'Maria',
        last_name: 'Garcia',
        date_of_birth: '2002-12-05',
        gender: 'Female',
        nationality: 'Spanish',
        email: 'maria.garcia@example.com',
        phone: '+34-600-123-456',
        high_school_name: 'Madrid International School',
        highest_qualification: 'A-Level',
        course_name: 'Psychology',
        status: 'admitted',
        submitted_at: '2024-01-05T08:45:00Z',
        updated_at: '2024-01-30T15:20:00Z',
        Institute: {
          id: 1,
          name: 'Stanford University',
          location: 'California, USA',
          type: 'University'
        },
        Faculty: {
          id: 6,
          name: 'Social Sciences',
          description: 'Faculty of Social Sciences'
        },
        guardian_name: 'Carlos Garcia',
        guardian_relationship: 'Father',
        guardian_phone: '+34-600-987-654',
        guardian_occupation: 'Psychologist'
      },
      {
        id: 7,
        first_name: 'Kenji',
        last_name: 'Tanaka',
        date_of_birth: '2001-09-14',
        gender: 'Male',
        nationality: 'Japanese',
        email: 'kenji.tanaka@example.com',
        phone: '+81-90-1234-5678',
        high_school_name: 'Tokyo High School',
        highest_qualification: 'IGCSE/LGCSE',
        course_name: 'Electrical Engineering',
        status: 'admitted',
        submitted_at: '2024-01-12T16:30:00Z',
        updated_at: '2024-01-27T12:10:00Z',
        Institute: {
          id: 3,
          name: 'MIT',
          location: 'Massachusetts, USA',
          type: 'University'
        },
        Faculty: {
          id: 1,
          name: 'Engineering',
          description: 'Faculty of Engineering and Technology'
        },
        guardian_name: 'Hiroshi Tanaka',
        guardian_relationship: 'Father',
        guardian_phone: '+81-90-8765-4321',
        guardian_occupation: 'Electrical Engineer'
      },
      {
        id: 8,
        first_name: 'Lina',
        last_name: 'Khalid',
        date_of_birth: '2003-04-25',
        gender: 'Female',
        nationality: 'Saudi Arabian',
        email: 'lina.khalid@example.com',
        phone: '+966-50-123-4567',
        high_school_name: 'Riyadh International School',
        highest_qualification: 'JC',
        course_name: 'Pharmacy',
        status: 'waitlisted',
        submitted_at: '2024-01-28T14:15:00Z',
        updated_at: '2024-02-01T10:30:00Z',
        Institute: {
          id: 2,
          name: 'Harvard University',
          location: 'Massachusetts, USA',
          type: 'University'
        },
        Faculty: {
          id: 2,
          name: 'Medical Sciences',
          description: 'Faculty of Medical and Health Sciences'
        },
        guardian_name: 'Omar Khalid',
        guardian_relationship: 'Father',
        guardian_phone: '+966-50-987-6543',
        guardian_occupation: 'Pharmacist'
      }
    ];
    
    // Apply filters if any
    let filteredData = [...sampleData];
    
    if (req.query.status && req.query.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === req.query.status);
    }
    
    if (req.query.institution && req.query.institution !== 'all') {
      const instId = parseInt(req.query.institution);
      filteredData = filteredData.filter(item => item.Institute.id === instId);
    }
    
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.first_name.toLowerCase().includes(searchTerm) ||
        item.last_name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.course_name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Statistics
    const total = filteredData.length;
    const admitted = filteredData.filter(app => app.status === 'admitted').length;
    const waitlisted = filteredData.filter(app => app.status === 'waitlisted').length;
    
    res.json({
      success: true,
      count: filteredData.length,
      statistics: {
        total,
        admitted,
        waitlisted,
        admissionRate: total > 0 ? ((admitted / total) * 100).toFixed(1) : 0
      },
      data: filteredData
    });
  } catch (error) {
    console.error('Error fetching sample data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sample data',
      error: error.message
    });
  }
});

module.exports = router;