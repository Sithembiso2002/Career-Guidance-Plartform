// test-backend-routes.js
const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testRoutes() {
  try {
    console.log('🔍 Testing backend routes...\n');

    // Test basic server connection
    console.log('1. Testing server connection...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/api/health`);
      console.log('✅ Server is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server connection failed:', error.message);
      return;
    }

    // Test GET courses
    console.log('\n2. Testing GET /api/courses...');
    try {
      const getResponse = await axios.get(`${API_BASE}/api/courses`);
      console.log('✅ GET /api/courses:', getResponse.data.success ? 'Success' : 'Failed');
      console.log('   Count:', getResponse.data.count);
    } catch (error) {
      console.log('❌ GET /api/courses failed:', error.response?.data || error.message);
    }

    // Test POST courses
    console.log('\n3. Testing POST /api/courses...');
    try {
      const postData = {
        course_name: 'Test Course',
        course_code: 'TEST001',
        faculty_id: 1,
        institute_id: 1,
        credits: 3,
        duration: '6 months',
        status: 'Active'
      };
      const postResponse = await axios.post(`${API_BASE}/api/courses`, postData);
      console.log('✅ POST /api/courses:', postResponse.data.success ? 'Success' : 'Failed');
    } catch (error) {
      console.log('❌ POST /api/courses failed:', error.response?.data?.message || error.message);
    }

    // Test PUT courses
    console.log('\n4. Testing PUT /api/courses/1...');
    try {
      const putData = {
        course_name: 'Updated Course',
        course_code: 'UPD001',
        faculty_id: 1,
        institute_id: 1,
        credits: 4,
        duration: '1 year',
        status: 'Active'
      };
      const putResponse = await axios.put(`${API_BASE}/api/courses/1`, putData);
      console.log('✅ PUT /api/courses/1:', putResponse.data.success ? 'Success' : 'Failed');
    } catch (error) {
      console.log('❌ PUT /api/courses/1 failed:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
    }

    // Test DELETE courses
    console.log('\n5. Testing DELETE /api/courses/1...');
    try {
      const deleteResponse = await axios.delete(`${API_BASE}/api/courses/1`);
      console.log('✅ DELETE /api/courses/1:', deleteResponse.data.success ? 'Success' : 'Failed');
    } catch (error) {
      console.log('❌ DELETE /api/courses/1 failed:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }

    // List all registered routes from server
    console.log('\n6. Checking server console for registered routes...');
    console.log('   Please check your backend server console output for the "=== Registered Routes ===" section');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRoutes();