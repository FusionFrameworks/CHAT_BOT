<<<<<<< HEAD
=======
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


>>>>>>> 8129dfcd84df410af263dc9f03339954ea0e0c2a
// config/db.js

const mongoose = require('mongoose');

<<<<<<< HEAD
// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ashish:goswami@cluster0.trds1g8.mongodb.net/patientregister', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
=======
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ashish:goswami@cluster0.trds1g8.mongodb.net/patientregister', { // Replace with your MongoDB connection string
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
>>>>>>> 8129dfcd84df410af263dc9f03339954ea0e0c2a
        process.exit(1);
    }
};

module.exports = connectDB;
