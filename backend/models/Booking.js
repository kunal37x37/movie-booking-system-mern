const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showTime: { type: String, required: true },
    showDate: { type: String, required: true },
    seats: [String],
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'completed' },
});

module.exports = mongoose.model('Booking', bookingSchema);