const prisma = require('../config/prisma');

/**
 * Create a new trip
 */
const createTrip = async (userId, data) => {
  const { title, description, startDate, endDate, isPublic, coverImageUrl } = data;

  return prisma.trip.create({
    data: {
      title,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPublic: isPublic ?? false,
      coverImage: coverImageUrl || null,
      user: { connect: { id: userId } },
    },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
    },
  });
};

/**
 * Get all trips belonging to a user
 */
const getMyTrips = async (userId) => {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, profileImage: true } },
    },
  });
};

/**
 * Get single trip with full details (stops + activities + expenses)
 */
const getTripById = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      stops: {
        include: {
          city: true,
          activities: { orderBy: { order: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
      expenses: true,
    },
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  // Calculate budget
  const activitiesTotal = trip.stops.reduce(
    (sum, stop) => sum + stop.activities.reduce((a, act) => a + act.cost, 0),
    0
  );

  const expensesTotal = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const grandTotal = activitiesTotal + expensesTotal;

  return {
    ...trip,
    budget: {
      activitiesTotal,
      expensesTotal,
      grandTotal,
      breakdown: trip.expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {}),
    },
  };
};

/**
 * Update trip fields
 */
const updateTrip = async (tripId, userId, data) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  return prisma.trip.update({
    where: { id: tripId },
    data,
    include: {
      user: { select: { name: true, profileImage: true } },
    },
  });
};

/**
 * Delete trip (and cascade delete stops, activities, etc.)
 */
const deleteTrip = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  await prisma.trip.delete({ where: { id: tripId } });
};

/**
 * REPLACE ALL stops for a trip (add / update / remove)
 * Cities must already exist in the City model
 */
const addOrReplaceStops = async (tripId, userId, stopsInput) => {
  // 1. Verify trip exists and belongs to user
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  // 2. Validate input
  if (!Array.isArray(stopsInput)) {
    throw new Error('Stops must be an array');
  }

  // Optional: Validate that all cityIds exist
  const cityIds = stopsInput.map((s) => s.cityId);
  const existingCities = await prisma.city.findMany({
    where: { id: { in: cityIds } },
    select: { id: true },
  });

  const foundIds = new Set(existingCities.map((c) => c.id));
  const missing = cityIds.filter((id) => !foundIds.has(id));

  if (missing.length > 0) {
    throw new Error(`Cities not found: ${missing.join(', ')}`);
  }

  // 3. Delete all existing stops (replace strategy)
  await prisma.tripStop.deleteMany({ where: { tripId } });

  // 4. Create new stops with order
  await prisma.tripStop.createMany({
    data: stopsInput.map((stop, index) => ({
      order: index + 1,
      startDate: new Date(stop.startDate),
      endDate: new Date(stop.endDate),
      tripId,
      cityId: stop.cityId,
    })),
  });

  // 5. Return updated trip with stops
  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        include: { city: true },
        orderBy: { order: 'asc' },
      },
    },
  });
};

/**
 * Reorder existing stops by providing array of stop IDs
 */
const reorderStops = async (tripId, userId, orderedStopIds) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { stops: true },
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  const currentIds = new Set(trip.stops.map((s) => s.id));
  const invalidIds = orderedStopIds.filter((id) => !currentIds.has(id));

  if (invalidIds.length > 0) {
    throw new Error(`Invalid stop IDs: ${invalidIds.join(', ')}`);
  }

  // Update order in transaction
  await prisma.$transaction(
    orderedStopIds.map((stopId, index) =>
      prisma.tripStop.update({
        where: { id: stopId },
        data: { order: index + 1 },
      })
    )
  );

  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        include: { city: true },
        orderBy: { order: 'asc' },
      },
    },
  });
};

/**
 * Get public trip (no ownership check)
 */
const getPublicTripById = async (tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      stops: {
        include: {
          city: true,
          activities: { orderBy: { order: 'asc' } },
        },
        orderBy: { order: 'asc' },
      },
      expenses: true,
    },
  });

  if (!trip || !trip.isPublic) {
    throw new Error('Trip not found or not public');
  }

  const activitiesTotal = trip.stops.reduce(
    (sum, stop) => sum + stop.activities.reduce((a, act) => a + act.cost, 0),
    0
  );

  const expensesTotal = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    ...trip,
    budget: {
      activitiesTotal,
      expensesTotal,
      grandTotal: activitiesTotal + expensesTotal,
      breakdown: trip.expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {}),
    },
  };
};

module.exports = {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addOrReplaceStops,
  reorderStops,
  getPublicTripById,
};