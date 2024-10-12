// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow all origins
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // Use port 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
