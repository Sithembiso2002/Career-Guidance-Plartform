// test-routes.js
const express = require('express');
const app = express();

// Simple route tester
app.get('/api/test-routes', (req, res) => {
  const routes = [
    'GET /api/courses',
    'GET /api/courses/:id', 
    'POST /api/courses',
    'PUT /api/courses/:id',
    'DELETE /api/courses/:id'
  ];
  
  res.json({
    message: 'Available course routes:',
    routes: routes
  });
});

app.listen(5001, () => {
  console.log('Route tester running on port 5001');
  console.log('Visit http://localhost:5001/api/test-routes to check routes');
});