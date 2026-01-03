const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors('*'));
app.use(express.json());
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const tripRoutes = require('./routes/tripRoutes');
const activityRoutes = require('./routes/activityRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/expenses', expenseRoutes);



app.get("/", (req, res) => {
  res.send("Smart Collab Backend is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});