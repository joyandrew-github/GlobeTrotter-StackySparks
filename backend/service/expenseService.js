const prisma = require('../config/prisma');

const addExpenses = async (tripId, userId, expenses) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found or access denied');
  }

  // Replace all existing expenses
  await prisma.expense.deleteMany({ where: { tripId } });

  const createdExpenses = await prisma.expense.createMany({
    data: expenses.map(exp => ({
      category: exp.category,
      amount: Number(exp.amount),
      note: exp.note || null,
      tripId
    }))
  });

  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: { expenses: true }
  });
};

module.exports = { addExpenses };