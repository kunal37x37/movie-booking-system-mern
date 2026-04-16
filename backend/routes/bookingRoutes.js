const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { authMiddleware } = require('../middleware/auth');

// Create booking
router.post('/', authMiddleware, async(req, res) => {
    try {
        const { movieId, showTime, showDate, seats, totalAmount } = req.body;

        console.log('Booking request:', { movieId, showTime, showDate, seats, totalAmount });

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Find the show
        let show = null;
        for (var i = 0; i < movie.shows.length; i++) {
            if (movie.shows[i].time === showTime) {
                show = movie.shows[i];
                break;
            }
        }

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        // Initialize bookedSeats if not exists
        if (!show.bookedSeats) {
            show.bookedSeats = [];
        }

        // Check seat availability
        var seatsToBook = [];
        for (var i = 0; i < seats.length; i++) {
            seatsToBook.push(seats[i].id);
        }

        var isAvailable = true;
        for (var i = 0; i < seatsToBook.length; i++) {
            if (show.bookedSeats.indexOf(seatsToBook[i]) !== -1) {
                isAvailable = false;
                break;
            }
        }

        if (!isAvailable) {
            return res.status(400).json({ message: 'Some seats are already booked' });
        }

        // Add seats to bookedSeats
        for (var i = 0; i < seatsToBook.length; i++) {
            show.bookedSeats.push(seatsToBook[i]);
        }

        await movie.save();

        // Create booking
        const booking = new Booking({
            userId: req.user.id,
            movieId: movieId,
            showTime: showTime,
            showDate: showDate,
            seats: seatsToBook,
            totalAmount: totalAmount,
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking successful',
            booking: booking
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Get user bookings
router.get('/my-bookings', authMiddleware, async(req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('movieId')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get owner bookings
router.get('/owner-bookings', authMiddleware, async(req, res) => {
    try {
        const movies = await Movie.find({ ownerId: req.user.id });
        var movieIds = [];
        for (var i = 0; i < movies.length; i++) {
            movieIds.push(movies[i]._id);
        }

        const bookings = await Booking.find({ movieId: { $in: movieIds } })
            .populate('movieId')
            .populate('userId', 'name email');

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;