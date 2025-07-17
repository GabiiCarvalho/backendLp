const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');

// Middleware CORS específico para as rotas
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Rotas normais
router.post('/contact', controller.submitContactForm);
router.get('/contacts', controller.getContacts);

module.exports = router;