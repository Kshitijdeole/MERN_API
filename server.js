const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('./routes/authRoutes'); // Adjust the path as necessary
const employeeRoutes = require('./routes/employeeRoutes'); // Adjust the path as necessary
const authMiddleware = require('./middlewares/authMiddleware');
const cookieParser = require("cookie-parser"); // Adjust the path as necessary
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config()
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(cookieParser());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {

})
    .then(() => {
        console.log('Connected to MongoDB');

        // Public Routes
        app.use('/api/auth', authRoutes);

        // Private Routes (require authentication)
        app.use('/api/employees', authMiddleware, employeeRoutes);

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process with failure code
    });
