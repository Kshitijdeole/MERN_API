const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication Routes
router.post('/register', authController.registerValidation, authController.register);
router.post('/login',authController.loginValidation ,authController.login);
router.post('/logout', authController.logout);

module.exports = router;
