const express = require('express');
const router = express.Router();
const tripController = require('../controller/tripController');
const {uploadCoverImage} = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, uploadCoverImage, tripController.createTrip);
router.get('/my', authMiddleware, tripController.getMyTrips);
router.get('/:tripId', authMiddleware, tripController.getTrip);
router.patch('/:tripId', authMiddleware, uploadCoverImage, tripController.updateTrip);
router.delete('/:tripId', authMiddleware, tripController.deleteTrip);
router.post('/:tripId/stops', authMiddleware, tripController.addStops);
router.patch('/:tripId/stops/order', authMiddleware, tripController.updateStopsOrder);
router.get('/public/:tripId', tripController.getPublicTrip);

module.exports = router;