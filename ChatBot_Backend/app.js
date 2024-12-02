// // app.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // Import CORS
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');

// const app = express();

// // Middleware
// app.use(cors()); // Allow all origins
// app.use(bodyParser.json());

// // Connect to MongoDB
// connectDB();

// // Use Routes
// app.use('/api/auth', authRoutes);

// // Start the server
// const PORT = process.env.PORT || 5000; // Use port 5000
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });





    // const express = require('express');
    // const bodyParser = require('body-parser');
    // const cors = require('cors');
    // const connectDB = require('./config/db');
    // const authRoutes = require('./routes/authRoutes');

    // const app = express();

    // // Middleware
    // app.use(cors()); // Allow all origins
    // app.use(bodyParser.json());

    // // Connect to MongoDB
    // connectDB();

    // // Use Routes
    // app.use('/api/auth', authRoutes);

    // // Notifications SSE
    // const clients = []; // Array to store active SSE connections

    // // SSE Endpoint
    // app.get('/api/notifications/stream', (req, res) => {
    //     res.setHeader('Content-Type', 'text/event-stream');
    //     res.setHeader('Cache-Control', 'no-cache');
    //     res.setHeader('Connection', 'keep-alive');

    //     // Add client connection to the array
    //     const clientId = Date.now();
    //     const newClient = { id: clientId, res };
    //     clients.push(newClient);

    //     // Send initial message to client
    //     res.write(`data: Connected to notifications stream\n\n`);

    //     // Remove client on disconnection
    //     req.on('close', () => {
    //         clients.splice(clients.indexOf(newClient), 1);
    //         console.log(`Client ${clientId} disconnected from notifications stream`);
    //     });
    // });

    // // Function to send updates to all connected clients
    // const sendNotificationUpdates = (notification) => {
    //     clients.forEach((client) => {
    //         client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
    //     });
    // };

    // // Export the sendNotificationUpdates function for use in other routes
    // module.exports = { sendNotificationUpdates };

    // // Start the server
    // const PORT = process.env.PORT || 5000;
    // app.listen(PORT, () => {
    //     console.log(`Server running on port ${PORT}`);
    // });




    const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors()); // Allow all origins
app.use(bodyParser.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);

// Notifications SSE
global.clients = []; // Global array to store active SSE connections

// SSE Endpoint for Notifications
app.get('/api/notifications/stream', (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the new client to the global clients array
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    global.clients.push(newClient);

    console.log(`Client ${clientId} connected to notifications stream`);

    // Send an initial message to confirm the connection
    res.write(`data: Connected to notifications stream\n\n`);

    // Remove the client on disconnection
    req.on('close', () => {
        global.clients = global.clients.filter(client => client.id !== clientId);
        console.log(`Client ${clientId} disconnected from notifications stream`);
    });
});

// Function to send real-time updates to all connected clients
const sendNotificationUpdates = (notification) => {
    global.clients.forEach((client) => {
        client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
    });
};

// Export the function to use it in other modules (e.g., routes or controllers)
module.exports = { sendNotificationUpdates };

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
