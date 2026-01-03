const express = require('express');
const router = express.Router();
const cityController = require('../controller/cityController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/search', cityController.searchCities);
router.get('/popular', cityController.getPopularCities);

// Protected routes (require login)
router.get('/me/saved', authMiddleware, cityController.getMySavedCities);
router.post('/me/saved/:cityId', authMiddleware, cityController.saveCity);
router.delete('/me/saved/:cityId', authMiddleware, cityController.unsaveCity);

module.exports = router;