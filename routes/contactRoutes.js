const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


router.post('/api/contact', contactController.submitContactForm);

router.get('/api/contact', contactController.getContact);

module.exports = router;