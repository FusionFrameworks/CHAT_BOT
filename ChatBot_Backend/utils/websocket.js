const WebSocket = require("ws");
const Payment = require("../models/paymentModel");

let connectedClients = [];

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // WebSocket connection handler
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    connectedClients.push(ws);

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      connectedClients = connectedClients.filter((client) => client !== ws);
    });
  });

  // Helper function to send the latest payment to all connected clients
  const sendLatestPayment = async () => {
    try {
      const latestPayment = await Payment.findOne().sort({ createdAt: -1 });
      if (latestPayment) {
        console.log("Latest Payment:", {
          paymentId: latestPayment.paymentId,
          patientId: latestPayment.patientId,
          name: latestPayment.name,
          amount: latestPayment.amount,
          status: latestPayment.status,
          createdAt: latestPayment.createdAt,
        });

        connectedClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(latestPayment));
          }
        });
      }
    } catch (error) {
      console.error("Error fetching latest payment:", error);
    }
  };

  // Watch for changes in the Payment collection
  Payment.watch().on("change", async () => {
    await sendLatestPayment();
  });

  console.log("WebSocket server is set up");
};

module.exports = setupWebSocket;
