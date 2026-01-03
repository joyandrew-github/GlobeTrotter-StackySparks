const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:tripId', authMiddleware, expenseController.addExpenses);

module.exports = router;