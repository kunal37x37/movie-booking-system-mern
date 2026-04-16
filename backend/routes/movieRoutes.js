const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { authMiddleware, isOwner } = require('../middleware/auth');

// Get all movies
router.get('/', async(req, res) => {
    try {
        const movies = await Movie.find().populate('ownerId', 'name');
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single movie
router.get('/:id', async(req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('ownerId', 'name');
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add movie (owner only)
router.post('/', authMiddleware, isOwner, async(req, res) => {
    try {
        console.log('Adding movie for owner:', req.user.id);
        console.log('Received data:', JSON.stringify(req.body, null, 2));

        const {
            name,
            description,
            language,
            genre,
            duration,
            image,
            basePrice,
            seatCategories,
            shows,
            status
        } = req.body;

        // Create movie with all fields
        const movie = new Movie({
            name: name,
            description: description,
            language: language,
            genre: genre,
            duration: duration,
            image: image,
            basePrice: basePrice || 150,
            seatCategories: seatCategories || [],
            shows: shows || [{ time: '10:00 AM', date: new Date().toISOString().split('T')[0], bookedSeats: [] }],
            status: status || 'now-showing',
            ownerId: req.user.id,
        });

        await movie.save();
        console.log('Movie saved successfully:', movie._id);
        res.status(201).json({ success: true, movie: movie });

    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update movie
router.put('/:id', authMiddleware, isOwner, async(req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        if (movie.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );
        res.json({ success: true, movie: updatedMovie });

    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete movie
router.delete('/:id', authMiddleware, isOwner, async(req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        if (movie.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await movie.deleteOne();
        res.json({ success: true, message: 'Movie deleted successfully' });

    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;