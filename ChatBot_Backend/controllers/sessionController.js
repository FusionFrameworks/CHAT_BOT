// authController.js
const getSession = async (req, res) => {
    try {
        // Check if the session exists and contains the user data
        if (req.session && req.session.user) {
            // Send the session data (patientId, name)
            return res.status(200).json({
                patientId: req.session.user.patientId,
                name: req.session.user.name,
            });
        } else {
            // If session doesn't exist or user is not logged in
            return res.status(401).json({ message: 'No session data found. Please log in first.' });
        }
    } catch (error) {
        console.error("Error fetching session data:", error);
        return res.status(500).json({ message: 'Failed to retrieve session data.' });
    }
};

module.exports = { getSession };
