const expenseService = require('../service/expenseService');

const addExpenses = async (req, res) => {
  const { tripId } = req.params;
  const expenses = req.body; // array

  try {
    const trip = await expenseService.addExpenses(tripId, req.user.id, expenses);
    res.status(200).json({
      success: true,
      message: 'Expenses added successfully',
      data: trip.expenses
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { addExpenses };