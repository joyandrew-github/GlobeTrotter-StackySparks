const prisma = require('../config/prisma');

const addActivitiesToStop = async (tripStopId, userId, activities) => {
  // Verify ownership through trip → stop
  const stop = await prisma.tripStop.findUnique({
    where: { id: tripStopId },
    include: { trip: true }
  });

  if (!stop || stop.trip.userId !== userId) {
    throw new Error('Trip stop not found or access denied');
  }

  // Optional: clear existing activities first (replace strategy)
  await prisma.activity.deleteMany({ where: { tripStopId } });

  const createdActivities = await prisma.activity.createMany({
    data: activities.map((act, index) => ({
      name: act.name,
      type: act.type,
      cost: Number(act.cost),
      durationHr: Number(act.durationHr),
      day: Number(act.day),
      order: index + 1,
      tripStopId
    }))
  });

  return await prisma.tripStop.findUnique({
    where: { id: tripStopId },
    include: { activities: { orderBy: { order: 'asc' } }, city: true }
  });
};

const updateActivityOrder = async (tripStopId, userId, orderedActivityIds) => {
  const stop = await prisma.tripStop.findFirst({
    where: { id: tripStopId, trip: { userId } }
  });

  if (!stop) throw new Error('Access denied');

  const updates = orderedActivityIds.map((id, index) =>
    prisma.activity.update({
      where: { id },
      data: { order: index + 1 }
    })
  );

  await Promise.all(updates);

  return await prisma.tripStop.findUnique({
    where: { id: tripStopId },
    include: { activities: { orderBy: { order: 'asc' } } }
  });
};

module.exports = { addActivitiesToStop, updateActivityOrder };