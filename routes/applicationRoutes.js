// routes/applicationRoutes.js - TEMPORARY VERSION (No file uploads)
const express = require('express');
const router = express.Router();
const { Application, Institute, Faculty } = require('../models');

// Submit new application (without file uploads for now)
router.post('/student-applications', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      email,
      phone,
      highSchoolName,
      highestQualification,
      guardianName,
      guardianRelationship,
      guardianPhone,
      guardianOccupation,
      institution_id,
      faculty_id,
      course_id
    } = req.body;

    // Create application using Sequelize (without files for now)
    const application = await Application.create({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender: gender,
      nationality: nationality,
      email: email,
      phone: phone,
      high_school_name: highSchoolName,
      highest_qualification: highestQualification,
      final_results_file: null, // Will be added later
      passport_photo: null, // Will be added later
      birth_certificate: null, // Will be added later
      guardian_name: guardianName,
      guardian_relationship: guardianRelationship,
      guardian_phone: guardianPhone,
      guardian_occupation: guardianOccupation,
      institution_id: institution_id,
      faculty_id: faculty_id,
      course_name: course_id
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: application.id
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit application',
      details: error.message 
    });
  }
});

// Get all applications (for admin)
router.get('/admin/applications', async (req, res) => {
  try {
    const applications = await Application.findAll({
      order: [['submitted_at', 'DESC']]
    });

    // Get additional details for each application
    const applicationsWithDetails = await Promise.all(
      applications.map(async (app) => {
        const applicationData = app.toJSON();
        
        // Get institute name
        if (app.institution_id) {
          const institute = await Institute.findByPk(app.institution_id);
          applicationData.institution_name = institute ? institute.name : 'N/A';
        }
        
        // Get faculty name
        if (app.faculty_id) {
          const faculty = await Faculty.findByPk(app.faculty_id);
          applicationData.faculty_name = faculty ? faculty.name : 'N/A';
        }
        
        return applicationData;
      })
    );

    res.json({
      success: true,
      applications: applicationsWithDetails
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
});

// Get single application
router.get('/admin/applications/:id', async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    const applicationData = application.toJSON();
    
    // Get additional details
    if (application.institution_id) {
      const institute = await Institute.findByPk(application.institution_id);
      applicationData.institution_name = institute ? institute.name : 'N/A';
    }
    
    if (application.faculty_id) {
      const faculty = await Faculty.findByPk(application.faculty_id);
      applicationData.faculty_name = faculty ? faculty.name : 'N/A';
    }

    res.json({
      success: true,
      application: applicationData
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application'
    });
  }
});

// Update application status
router.patch('/admin/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'under_review', 'admitted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status' 
      });
    }

    const application = await Application.findByPk(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application status'
    });
  }
});

// Health check for applications
router.get('/applications/health', (req, res) => {
  res.json({
    success: true,
    message: 'Applications routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;