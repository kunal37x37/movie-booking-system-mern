const mongoose = require('mongoose');

const seatCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    rows: { type: [String], required: true },
    seatsPerRow: { type: Number, required: true },
    seats: { type: [String], default: [] },
    bookedSeats: { type: [String], default: [] }
});

const showSchema = new mongoose.Schema({
    time: { type: String, required: true },
    date: { type: String, required: true },
    bookedSeats: { type: [String], default: [] }
});

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    basePrice: { type: Number, default: 150 },
    seatCategories: [seatCategorySchema],
    shows: [showSchema],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['now-showing', 'upcoming'], default: 'now-showing' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Movie', movieSchema);