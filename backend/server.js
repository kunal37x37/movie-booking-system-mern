const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/moviebooking')
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        console.log('📀 Database: moviebooking');
    })
    .catch(err => {
        console.log('❌ MongoDB Connection Error:', err.message);
        console.log('💡 Make sure MongoDB Compass is running on localhost:27017');
    });

// Import Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const otpRoutes = require('./routes/otpRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/otp', otpRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({
        message: '🎬 Movie Booking API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            movies: '/api/movies',
            bookings: '/api/bookings',
            otp: '/api/otp'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Test API: http://localhost:${PORT}`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`🎬 Movies API: http://localhost:${PORT}/api/movies`);
    console.log(`🎫 Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(`🔢 OTP API: http://localhost:${PORT}/api/otp`);
});