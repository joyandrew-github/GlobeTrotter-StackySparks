const tripService = require('../service/tripService');

const parseBoolean = (value) => {
  if (value === 'true' || value === true || value === '1') return true;
  if (value === 'false' || value === false || value === '0') return false;
  return undefined; // let Prisma use default
};

const createTrip = async (req, res) => {
  const userId = req.user.id;
  const { title, description, startDate, endDate, isPublic } = req.body;
  const coverImageUrl = req.file ? req.file.path : null;

  // Convert isPublic string from form-data to boolean
  const isPublicBoolean = parseBoolean(isPublic);

  try {
    const trip = await tripService.createTrip(userId, {
      title,
      description,
      startDate,
      endDate,
      isPublic: isPublicBoolean,
      coverImageUrl
    });
    res.status(201).json({ success: true, message: 'Trip created', data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const { title, description, startDate, endDate, isPublic } = req.body;
  const coverImageUrl = req.file ? req.file.path : null;

  // Convert isPublic if provided
  const isPublicBoolean = isPublic !== undefined ? parseBoolean(isPublic) : undefined;

  try {
    const trip = await tripService.updateTrip(tripId, req.user.id, {
      title,
      description,
      startDate,
      endDate,
      isPublic: isPublicBoolean,
      coverImageUrl
    });
    res.status(200).json({ success: true, message: 'Trip updated', data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await tripService.getMyTrips(req.user.id);
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    const trip = await tripService.getTripById(tripId, req.user.id);
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    await tripService.deleteTrip(tripId, req.user.id);
    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addStops = async (req, res) => {
  const { tripId } = req.params;
  const stops = req.body; // array of { cityId, startDate, endDate }

  try {
    const trip = await tripService.addStops(tripId, req.user.id, stops);
    res.status(200).json({
      success: true,
      message: 'Stops added successfully',
      data: trip
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateStopsOrder = async (req, res) => {
  const { tripId } = req.params;
  const { orderedStopIds } = req.body; // array of stop IDs in new order

  try {
    const trip = await tripService.updateStopsOrder(tripId, req.user.id, orderedStopIds);
    res.status(200).json({
      success: true,
      message: 'Order updated',
      data: trip
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getPublicTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await tripService.getPublicTripById(tripId);
    res.status(200).json({
      success: true,
      message: 'Public trip fetched',
      data: trip
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Trip not found or not public'
    });
  }
};

module.exports = { createTrip, getMyTrips, getTrip, updateTrip, deleteTrip, addStops, updateStopsOrder, getPublicTrip };