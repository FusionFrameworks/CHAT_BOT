const WebSocket = require("ws");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");

let connectedClients = [];
let appointmentCount = 0; // Initial appointment count

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
        const message = {
          type: "latestPayment",
          paymentId: latestPayment.paymentId,
          patientId: latestPayment.patientId,
          status: latestPayment.status,
          createdAt: latestPayment.createdAt,
        };

        console.log("Latest Payment:", message);

        connectedClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      }
    } catch (error) {
      console.error("Error fetching latest payment:", error);
    }
  };

  // Helper function to send patients who have made payments
  const sendPatientsWithPayments = async () => {
    try {
      const payments = await Payment.find();
      const patientIdsWithPayments = payments.map(
        (payment) => payment.patientId
      );

      const usersWithPayments = await User.find({
        patientId: { $in: patientIdsWithPayments },
      });

      const patientsDetails = usersWithPayments.map((user) => ({
        patientId: user.patientId,
        patientName: user.name,
        age: user.age,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
      }));

      const message = {
        type: "patientsWithPayments",
        data: patientsDetails,
      };

      console.log("Patients with Payments:", patientsDetails);

      connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
      console.error("Error fetching patients with payments:", error);
    }
  };

  // Helper function to send the appointment count to all connected clients
  const sendAppointmentCount = () => {
    const message = {
      type: "appointmentCount",
      count: appointmentCount,
    };

    console.log("Total Appointments Count:", appointmentCount);

    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  const updateAppointmentCount = async () => {
    try {
      const payments = await Payment.find();
      const patientIdsWithPayments = payments.map(
        (payment) => payment.patientId
      );

      const usersWithPayments = await User.find({
        patientId: { $in: patientIdsWithPayments },
      });

      appointmentCount = usersWithPayments.length;

      console.log(`Updated appointment count: ${appointmentCount}`);
      sendAppointmentCount();
    } catch (error) {
      console.error("Error updating appointment count:", error);
    }
  };

  Payment.watch().on("change", async (change) => {
    if (change.operationType === "insert") {
      console.log("New payment added. Updating appointment count...");
      await updateAppointmentCount();
    }

    await sendLatestPayment();
    await sendPatientsWithPayments();
  });

  console.log("WebSocket server is set up");
  updateAppointmentCount();
};

module.exports = setupWebSocket;