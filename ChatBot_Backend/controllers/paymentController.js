const Payment = require('../models/paymentModel');

// Controller for storing payment information
exports.storePayment = async (req, res) => {
    const { paymentId, patientId, amount, status } = req.body;

    // Validate required fields
    if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID are required.' });
    }

    try {
        // Create a new payment record
        const payment = new Payment({
            paymentId,
            patientId,
            amount,
            status: status || 'pending', // Default status if not provided
        });

        // Save the payment record to the database
        await payment.save();
        res.status(201).json({ message: 'Payment stored successfully.', payment });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate payment ID error
            res.status(400).json({ error: 'Payment ID must be unique.' });
        } else {
            res.status(500).json({ error: 'Failed to store payment.', details: error.message });
        }
    }
};
