const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

// Load environment variables
dotenv.config();

// CORS Configuration - Updated & Corrected
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL (Vite default)
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow all needed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow auth headers (JWT, etc.)
  credentials: true, // Important if you're sending cookies or auth headers
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const tripRoutes = require('./routes/tripRoutes');
const activityRoutes = require('./routes/activityRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/expenses', expenseRoutes);

app.get("/", (req, res) => {
  res.send("Globe Trotter Backend is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});