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
        console.log("Latest Payment:", {
          paymentId: latestPayment.paymentId,
          patientId: latestPayment.patientId,
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

  // Helper function to send patients who have made payments
  const sendPatientsWithPayments = async () => {
    try {
      // Get all payment entries
      const payments = await Payment.find();

      // Get patient IDs from payments
      const patientIdsWithPayments = payments.map(
        (payment) => payment.patientId
      );

      // Get users (patients) who have matching patientId in payments
      const usersWithPayments = await User.find({
        patientId: { $in: patientIdsWithPayments },
      });

      // Map to extract only the required patient details
      const patientsDetails = usersWithPayments.map((user) => ({
        patientId: user.patientId,
        patientName: user.name,
        age: user.age,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
      }));

      console.log("Patients with Payments:", patientsDetails);

      // Send patient data to all connected clients
      connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "patientsWithPayments",
              data: patientsDetails,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error fetching patients with payments:", error);
    }
  };

  // Helper function to send the appointment count to all connected clients
  const sendAppointmentCount = () => {
    console.log("Total Appointments Count:", appointmentCount);

    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "appointmentCount", count: appointmentCount })
        );
      }
    });
  };

  // Helper function to update appointment count based on payments
  const updateAppointmentCount = async () => {
    try {
      // Get all payment entries
      const payments = await Payment.find();

      // Get patient IDs from payments
      const patientIdsWithPayments = payments.map(
        (payment) => payment.patientId
      );

      // Get users (patients) who have matching patientId in payments
      const usersWithPayments = await User.find({
        patientId: { $in: patientIdsWithPayments },
      });

      // Set appointment count to the number of users with matching patientIds
      appointmentCount = usersWithPayments.length;

      console.log(`Updated appointment count: ${appointmentCount}`);
      sendAppointmentCount(); // Send the updated count to clients
    } catch (error) {
      console.error("Error updating appointment count:", error);
    }
  };

  // Watch for changes in the Payment collection
  Payment.watch().on("change", async (change) => {
    // If the change is an insert (new payment), we treat it as a new appointment
    if (change.operationType === "insert") {
      console.log("New payment added. Updating appointment count...");
      await updateAppointmentCount(); // Update the appointment count
    }

    await sendLatestPayment(); // Send the latest payment
    await sendPatientsWithPayments(); // Send patients with payments
  });

  console.log("WebSocket server is set up");

  // Initialize appointment count by getting the number of patients who have made payments
  updateAppointmentCount(); // Set the initial appointment count
};

module.exports = setupWebSocket;
