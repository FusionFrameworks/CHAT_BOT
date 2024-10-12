// // config/db.js

// const mongoose = require('mongoose');

// // Function to connect to MongoDB
// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://ashish:goswami@cluster0.trds1g8.mongodb.net/patientregister', { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;


// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ashish:goswami@cluster0.trds1g8.mongodb.net/patientregister', { // Replace with your MongoDB connection string
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
