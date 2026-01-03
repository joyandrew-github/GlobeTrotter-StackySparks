const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.patch('/update-profile', authMiddleware, upload, authController.updateProfile);
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
module.exports = router;