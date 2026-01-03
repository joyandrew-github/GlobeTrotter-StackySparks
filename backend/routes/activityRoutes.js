const express = require('express');
const router = express.Router();
const activityController = require('../controller/activityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:stopId/activities', authMiddleware, activityController.addActivities);
router.patch('/:stopId/activities/order', authMiddleware, activityController.updateOrder);

module.exports = router;