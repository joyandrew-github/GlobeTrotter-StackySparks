const prisma = require('../config/prisma');

const createTrip = async (userId, { title, description, startDate, endDate, isPublic, coverImageUrl }) => {
  return await prisma.trip.create({
    data: {
      title,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPublic: isPublic || false,
      coverImage: coverImageUrl || null,
      user: { connect: { id: userId } }
    },
    include: { user: { select: { id: true, name: true, profileImage: true } } }
  });
};

const getMyTrips = async (userId) => {
  return await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, profileImage: true } } }
  });
};

const getTripById = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      stops: {
        include: {
          city: true,
          activities: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      expenses: true
    }
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  // ✅ BUDGET CALCULATION (Exactly like PDF)
  const activitiesTotal = trip.stops.reduce((sum, stop) => {
    return sum + stop.activities.reduce((aSum, act) => aSum + act.cost, 0);
  }, 0);

  const expensesTotal = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const grandTotal = activitiesTotal + expensesTotal;

  // Add calculated fields to response
  return {
    ...trip,
    budget: {
      activitiesTotal,
      expensesTotal,
      grandTotal,
      breakdown: trip.expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {})
    }
  };
};

const updateTrip = async (tripId, userId, { title, description, startDate, endDate, isPublic, coverImageUrl }) => {
  const data = {};
  if (title) data.title = title;
  if (description !== undefined) data.description = description || null;
  if (startDate) data.startDate = new Date(startDate);
  if (endDate) data.endDate = new Date(endDate);
  if (isPublic !== undefined) data.isPublic = isPublic;
  if (coverImageUrl) data.coverImage = coverImageUrl;

  return await prisma.trip.update({
    where: { id: tripId, userId },
    data,
    include: { user: { select: { name: true, profileImage: true } } }
  });
};

const deleteTrip = async (tripId, userId) => {
  await prisma.trip.delete({
    where: { id: tripId, userId }
  });
};

const addStops = async (tripId, userId, stops) => {
  // Validate trip ownership
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  // Delete existing stops (simple replace strategy)
  await prisma.tripStop.deleteMany({ where: { tripId } });

  // Create new stops with order
  const createdStops = await prisma.tripStop.createMany({
    data: stops.map((stop, index) => ({
      order: index + 1,
      startDate: new Date(stop.startDate),
      endDate: new Date(stop.endDate),
      tripId,
      cityId: stop.cityId
    }))
  });

  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: { stops: { include: { city: true }, orderBy: { order: 'asc' } } }
  });
};

const updateStopsOrder = async (tripId, userId, orderedStopIds) => {
  // Validate ownership
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { stops: true }
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  if (!orderedStopIds || orderedStopIds.length === 0) {
    throw new Error('No stop IDs provided');
  }

  // Get current stop IDs for this trip
  const currentStopIds = trip.stops.map(stop => stop.id);

  // Validate all provided IDs actually belong to this trip
  const invalidIds = orderedStopIds.filter(id => !currentStopIds.includes(id));
  if (invalidIds.length > 0) {
    throw new Error(`Invalid stop IDs: ${invalidIds.join(', ')}`);
  }

  // Only update valid ones
  const updates = orderedStopIds.map((stopId, index) =>
    prisma.tripStop.update({
      where: { id: stopId },
      data: { order: index + 1 }
    })
  );

  await Promise.all(updates);

  // Return fresh trip with ordered stops
  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        include: { city: true },
        orderBy: { order: 'asc' }
      }
    }
  });
};

const getPublicTripById = async (tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      stops: {
        include: {
          city: true,
          activities: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      expenses: true
    }
  });

  if (!trip || !trip.isPublic) {
    throw new Error('Trip not found or not public');
  }

  // Budget calculation (same as private)
  const activitiesTotal = trip.stops.reduce((sum, stop) => {
    return sum + stop.activities.reduce((aSum, act) => aSum + act.cost, 0);
  }, 0);

  const expensesTotal = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const grandTotal = activitiesTotal + expensesTotal;

  const breakdown = trip.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return {
    ...trip,
    budget: {
      activitiesTotal,
      expensesTotal,
      grandTotal,
      breakdown
    }
  };
};

module.exports = { createTrip, getMyTrips, getTripById, updateTrip, deleteTrip, addStops, updateStopsOrder, getPublicTripById };