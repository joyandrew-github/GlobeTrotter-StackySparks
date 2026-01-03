const tripService = require('../service/tripService');

const parseBoolean = (value) => {
  if (value === 'true' || value === true || value === '1') return true;
  if (value === 'false' || value === false || value === '0') return false;
  return undefined; // let Prisma use default value
};

const createTrip = async (req, res) => {
  const userId = req.user.id;
  const { title, description, startDate, endDate, isPublic } = req.body;
  const coverImageUrl = req.file?.path || null;

  const isPublicBoolean = parseBoolean(isPublic);

  try {
    const trip = await tripService.createTrip(userId, {
      title,
      description,
      startDate,
      endDate,
      isPublic: isPublicBoolean,
      coverImageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create trip',
    });
  }
};

const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;
  const { title, description, startDate, endDate, isPublic } = req.body;
  const coverImageUrl = req.file?.path || null;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description || null;
  if (startDate) updateData.startDate = new Date(startDate);
  if (endDate) updateData.endDate = new Date(endDate);
  if (isPublic !== undefined) updateData.isPublic = parseBoolean(isPublic);
  if (coverImageUrl) updateData.coverImageUrl = coverImageUrl;

  try {
    const updatedTrip = await tripService.updateTrip(tripId, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: updatedTrip,
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update trip',
    });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await tripService.getMyTrips(req.user.id);
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your trips',
    });
  }
};

const getTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await tripService.getTripById(tripId, req.user.id);
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    const status = error.message.includes('access denied') ? 403 : 404;
    res.status(status).json({
      success: false,
      message: error.message || 'Trip not found',
    });
  }
};

const deleteTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    await tripService.deleteTrip(tripId, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete trip',
    });
  }
};

/**
 * Add / Replace all stops (destinations) for a trip
 * POST /trips/:tripId/stops
 * Body: array of { cityId: string, startDate: string, endDate: string }
 */
const addStops = async (req, res) => {
  const { tripId } = req.params;
  const stops = req.body; // expected: array of objects

  if (!Array.isArray(stops) || stops.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body must be a non-empty array of stops',
    });
  }

  try {
    const updatedTrip = await tripService.addOrReplaceStops(tripId, req.user.id, stops);

    res.status(200).json({
      success: true,
      message: 'Trip destinations updated successfully',
      data: updatedTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update trip destinations',
    });
  }
};

/**
 * Reorder existing stops
 * PATCH /trips/:tripId/stops/order
 * Body: { orderedStopIds: string[] }
 */
const updateStopsOrder = async (req, res) => {
  const { tripId } = req.params;
  const { orderedStopIds } = req.body;

  if (!Array.isArray(orderedStopIds) || orderedStopIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'orderedStopIds must be a non-empty array',
    });
  }

  try {
    const updatedTrip = await tripService.reorderStops(tripId, req.user.id, orderedStopIds);

    res.status(200).json({
      success: true,
      message: 'Destinations order updated successfully',
      data: updatedTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reorder destinations',
    });
  }
};

const getPublicTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await tripService.getPublicTripById(tripId);
    res.status(200).json({
      success: true,
      message: 'Public trip fetched successfully',
      data: trip,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Trip not found or not public',
    });
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  addStops,
  updateStopsOrder,
  getPublicTrip,
};