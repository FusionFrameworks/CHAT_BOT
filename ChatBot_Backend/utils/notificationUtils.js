// utils/notificationUtils.js

// Global clients array to store SSE connections
global.clients = [];

// Function to send real-time updates to all connected clients
const sendNotificationUpdates = (notification) => {
  global.clients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
  });
};

module.exports = { sendNotificationUpdates };
