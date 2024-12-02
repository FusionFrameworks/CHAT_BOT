// const express = require('express');
// const { registerUser, loginUser, verifyOTP, getNotifications } = require('../controllers/authController'); // Include getNotifications

// const router = express.Router();

// // Routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/verify-otp', verifyOTP);
// router.get('/notifications', getNotifications); // New route for notifications

// module.exports = router;






// const express = require('express');
// const { registerUser, loginUser, verifyOTP, getNotifications,deleteNotificationByPatientId } = require('../controllers/authController');
// const { sendNotificationUpdates } = require('../app'); // Import SSE notification function

// const router = express.Router();

// // Routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);


// // Updated verify-otp route to send notifications
// router.post('/verify-otp', async (req, res) => {
//     const response = await verifyOTP(req, res);

//     if (response.status === 200) {
//         // Send notification update via SSE
//         const notification = {
//             name: response.name,
//             patientId: response.patientId,
//             message: 'OTP verification successful',
//             timestamp: new Date().toISOString(),
//         };
//         sendNotificationUpdates(notification); // Broadcast the notification
//     }
// });

// // Route to fetch historical notifications
// router.get('/notifications', getNotifications);
// router.post('/notifications/delete', authController.deleteNotificationByPatientId);


// // Route for SSE notifications stream
// router.get('/notifications/stream', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     // Add client connection to SSE stream
//     const clientId = Date.now();
//     const newClient = { id: clientId, res };
//     global.clients = global.clients || [];
//     global.clients.push(newClient);

//     // Send a message to confirm connection
//     res.write(`data: Connected to notifications stream\n\n`);

//     // Clean up client connection on disconnection
//     req.on('close', () => {
//         global.clients = global.clients.filter(client => client.id !== clientId);
//         console.log(`Client ${clientId} disconnected`);
//     });
// });

// module.exports = router;













// const express = require('express');
// const authController = require('../controllers/authController'); // Ensure correct import
// const { sendNotificationUpdates } = require('../app'); // Import SSE notification function

// const router = express.Router();

// // User Registration Route
// router.post('/register', authController.registerUser);

// // User Login Route
// router.post('/login', authController.loginUser);

// // Verify OTP Route with Notification Broadcast
// router.post('/verify-otp', async (req, res) => {
//     try {
//         const response = await authController.verifyOTP(req, res);

//         if (response.status === 200) {
//             // Broadcast notification upon successful OTP verification
//             const notification = {
//                 name: response.name,
//                 patientId: response.patientId,
//                 message: 'OTP verification successful',
//             };
//             sendNotificationUpdates(notification); // Broadcast the notification
//         }
//     } catch (error) {
//         console.error('Error in verify-otp route:', error);
//         res.status(500).json({ message: 'Error verifying OTP' });
//     }
// });

// // Route to Fetch Notifications
// router.get('/notifications', authController.getNotifications);
// // router.get('/notifications/:patientId', getNotifications);


// // Route to Delete Notification by Patient ID
// router.post('/notifications/delete', authController.deleteNotificationByPatientId);

// // Route for Server-Sent Events (SSE) Notifications Stream
// router.get('/notifications/stream', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     // Add client to SSE stream
//     const clientId = Date.now();
//     const newClient = { id: clientId, res };
//     global.clients = global.clients || [];
//     global.clients.push(newClient);

//     // Notify client of connection success
//     res.write(`data: Connected to notifications stream\n\n`);

//     // Clean up on client disconnection
//     req.on('close', () => {
//         global.clients = global.clients.filter(client => client.id !== clientId);
//         console.log(`Client ${clientId} disconnected`);
//     });
// });

// module.exports = router;










const express = require('express');
const authController = require('../controllers/authController'); // Ensure correct import
const { sendNotificationUpdates } = require('../app'); // Import SSE notification function
const Notification = require('../models/notificationModel');
const Payment = require('../models/paymentModel');
const paymentController = require('../controllers/paymentController');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

// User Registration Route
router.post('/register', authController.registerUser);

// User Login Route
router.post('/login', authController.loginUser);

// Verify OTP Route with Notification Broadcast
router.post('/verify-otp', async (req, res) => {
    try {
        const response = await authController.verifyOTP(req, res);

        if (response.status === 200) {
            // Broadcast notification upon successful OTP verification
            const notification = {
                name: response.name,
                patientId: response.patientId,
                message: 'OTP verification successful',
            };
            sendNotificationUpdates(notification); // Broadcast the notification
        }
    } catch (error) {
        console.error('Error in verify-otp route:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

// Route to Fetch Notifications
router.get('/notifications', async (req, res) => {
    try {
        // Fetch all notifications
        const notifications = await Notification.find();

        // Get completed payments based on payment status
        const completedPayments = await Payment.find({ status: 'completed' });

        // Create a Set of patientIds with completed payments for faster lookup
        const completedPatientIds = new Set(completedPayments.map(payment => payment.patientId));

        // Filter notifications to include only those with completed payments
        const filteredNotifications = notifications.filter(notification =>
            completedPatientIds.has(notification.patientId)
        );

        // Map the filtered notifications to return only relevant details (Patient ID and Name)
        const response = filteredNotifications.map(notification => ({
            patientId: notification.patientId,
            name: notification.name
        }));

        res.status(200).json({ notifications: response });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

// Route to Delete Notification by Patient ID
router.post('/notifications/delete', async (req, res) => {
    const { patientId } = req.body;  // Assuming you send the patientId in the body

    try {
        // Delete notifications based on patientId
        const result = await Notification.deleteMany({ patientId });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: `Notifications deleted for patientId: ${patientId}` });
        } else {
            res.status(404).json({ message: `No notifications found for patientId: ${patientId}` });
        }
    } catch (error) {
        console.error('Error deleting notifications:', error);
        res.status(500).json({ message: 'Failed to delete notifications' });
    }
});

// Route for Server-Sent Events (SSE) Notifications Stream
router.get('/notifications/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add client to SSE stream
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    global.clients = global.clients || [];
    global.clients.push(newClient);

    // Notify client of connection success
    res.write(`data: Connected to notifications stream\n\n`);

    // Clean up on client disconnection
    req.on('close', () => {
        global.clients = global.clients.filter(client => client.id !== clientId);
        console.log(`Client ${clientId} disconnected`);
    });
});

router.post('/store-payment', paymentController.storePayment);

// Route to get session data (patientId, name)
router.get('/get-session', sessionController.getSession);

module.exports = router;
