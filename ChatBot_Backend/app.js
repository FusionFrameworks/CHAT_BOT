const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost:3000 or any origin (null for non-browser requests like Postman)
      if (!origin || origin === "http://localhost:3000") {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/auth", authRoutes);

// Initialize global clients array for SSE
global.clients = [];

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
