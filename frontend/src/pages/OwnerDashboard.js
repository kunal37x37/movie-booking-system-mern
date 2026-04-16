import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('movies');
    const [editingMovie, setEditingMovie] = useState(null);
    const [viewingMovie, setViewingMovie] = useState(null);
    const [loading, setLoading] = useState(false);

    const [seatCategories, setSeatCategories] = useState([
        { name: 'PLATINUM', price: 350, color: '#9b59b6', rows: ['A', 'B', 'C'], seatsPerRow: 10 },
        { name: 'GOLD', price: 250, color: '#f39c12', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 12 },
        { name: 'SILVER', price: 150, color: '#bdc3c7', rows: ['H', 'I', 'J'], seatsPerRow: 14 }
    ]);

    const [showTimes, setShowTimes] = useState([
        { time: '10:00 AM', date: '', bookedSeats: [] },
        { time: '1:00 PM', date: '', bookedSeats: [] },
        { time: '4:00 PM', date: '', bookedSeats: [] },
        { time: '7:00 PM', date: '', bookedSeats: [] },
        { time: '10:00 PM', date: '', bookedSeats: [] }
    ]);

    const [stats, setStats] = useState({
        totalMovies: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalSeatsSold: 0
    });

    const [newMovie, setNewMovie] = useState({
        name: '',
        description: '',
        language: '',
        genre: '',
        duration: '',
        image: '',
        basePrice: 150,
        seatCategories: [],
        shows: [],
        status: 'now-showing',
    });

    useEffect(function() {
        if (user && user.id) {
            fetchMovies();
            fetchBookings();
        }
    }, [user]);

    const fetchMovies = async function() {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/movies');
            var userMovies = [];
            for (var i = 0; i < response.data.length; i++) {
                var movie = response.data[i];
                if (movie.ownerId && movie.ownerId._id === user.id) {
                    userMovies.push(movie);
                }
            }
            setMovies(userMovies);
            setStats(function(prev) {
                return {...prev, totalMovies: userMovies.length };
            });
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async function() {
        try {
            const response = await axios.get('http://localhost:5000/api/bookings/owner-bookings');
            setBookings(response.data);

            var total = response.data.length;
            var revenue = 0;
            var seats = 0;
            for (var i = 0; i < response.data.length; i++) {
                revenue = revenue + response.data[i].totalAmount;
                seats = seats + response.data[i].seats.length;
            }

            setStats(function(prev) {
                return {
                    ...prev,
                    totalBookings: total,
                    totalRevenue: revenue,
                    totalSeatsSold: seats
                };
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleCategoryChange = function(index, field, value) {
        var updatedCategories = [...seatCategories];
        updatedCategories[index][field] = value;
        setSeatCategories(updatedCategories);
    };

    const addCategory = function() {
        setSeatCategories([...seatCategories, { name: 'NEW', price: 100, color: '#6c5ce7', rows: ['K'], seatsPerRow: 10 }]);
    };

    const removeCategory = function(index) {
        var updated = [...seatCategories];
        updated.splice(index, 1);
        setSeatCategories(updated);
    };

    const handleShowTimeChange = function(index, field, value) {
        var updatedShows = [...showTimes];
        updatedShows[index][field] = value;
        setShowTimes(updatedShows);
    };

    const addShowTime = function() {
        setShowTimes([...showTimes, { time: '', date: '', bookedSeats: [] }]);
    };

    const removeShowTime = function(index) {
        var updated = [...showTimes];
        updated.splice(index, 1);
        setShowTimes(updated);
    };

    const handleAddMovie = async function(e) {
        e.preventDefault();
        try {
            setLoading(true);

            var categoriesWithSeats = [];
            for (var i = 0; i < seatCategories.length; i++) {
                var cat = seatCategories[i];
                var allSeats = [];
                for (var r = 0; r < cat.rows.length; r++) {
                    var row = cat.rows[r];
                    for (var s = 1; s <= cat.seatsPerRow; s++) {
                        allSeats.push(row + s);
                    }
                }
                categoriesWithSeats.push({
                    name: cat.name,
                    price: parseInt(cat.price),
                    color: cat.color,
                    rows: cat.rows,
                    seatsPerRow: cat.seatsPerRow,
                    seats: allSeats,
                    bookedSeats: []
                });
            }

            var today = new Date();
            var dateStr = today.toISOString().split('T')[0];

            var validShows = [];
            for (var j = 0; j < showTimes.length; j++) {
                if (showTimes[j].time && showTimes[j].time.trim() !== '') {
                    validShows.push({
                        time: showTimes[j].time,
                        date: dateStr,
                        bookedSeats: []
                    });
                }
            }

            const movieData = {
                name: newMovie.name,
                description: newMovie.description,
                language: newMovie.language,
                genre: newMovie.genre,
                duration: newMovie.duration,
                image: newMovie.image,
                basePrice: parseInt(newMovie.basePrice) || 150,
                seatCategories: categoriesWithSeats,
                shows: validShows,
                status: newMovie.status,
            };

            const response = await axios.post('http://localhost:5000/api/movies', movieData);

            if (response.data.success) {
                alert('✓ Movie added successfully!');
                setShowAddModal(false);
                resetForm();
                fetchMovies();
            }

        } catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add movie');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMovie = async function(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.put('http://localhost:5000/api/movies/' + editingMovie._id, editingMovie);
            if (response.data.success) {
                alert('✓ Movie updated successfully!');
                setShowEditModal(false);
                setEditingMovie(null);
                fetchMovies();
            }
        } catch (error) {
            console.error('Error updating movie:', error);
            alert('Failed to update movie');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMovie = async function(id) {
        if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
            try {
                await axios.delete('http://localhost:5000/api/movies/' + id);
                alert('✓ Movie deleted successfully!');
                fetchMovies();
            } catch (error) {
                alert('Failed to delete movie');
            }
        }
    };

    const openEditModal = function(movie) {
        setEditingMovie(movie);
        setShowEditModal(true);
    };

    const openDetailsModal = function(movie) {
        setViewingMovie(movie);
        setShowDetailsModal(true);
    };

    const resetForm = function() {
        setNewMovie({
            name: '',
            description: '',
            language: '',
            genre: '',
            duration: '',
            image: '',
            basePrice: 150,
            seatCategories: [],
            shows: [],
            status: 'now-showing',
        });
        setSeatCategories([
            { name: 'PLATINUM', price: 350, color: '#9b59b6', rows: ['A', 'B', 'C'], seatsPerRow: 10 },
            { name: 'GOLD', price: 250, color: '#f39c12', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 12 },
            { name: 'SILVER', price: 150, color: '#bdc3c7', rows: ['H', 'I', 'J'], seatsPerRow: 14 }
        ]);
        setShowTimes([
            { time: '10:00 AM', date: '', bookedSeats: [] },
            { time: '1:00 PM', date: '', bookedSeats: [] },
            { time: '4:00 PM', date: '', bookedSeats: [] },
            { time: '7:00 PM', date: '', bookedSeats: [] },
            { time: '10:00 PM', date: '', bookedSeats: [] }
        ]);
    };

    return ( <
        div className = "owner-dashboard" > { /* Sidebar */ } <
        aside className = "owner-sidebar" >
        <
        div className = "sidebar-header" >
        <
        div className = "theatre-icon" > 🏢 < /div> <
        h3 className = "theatre-name" > CineBook Theatre < /h3> <
        p className = "owner-name" > { user && user.name } < /p> <
        p className = "owner-email" > { user && user.email } < /p> <
        /div>

        <
        nav className = "sidebar-nav" >
        <
        button className = { 'nav-item ' + (activeTab === 'movies' ? 'active' : '') }
        onClick = {
            function() { setActiveTab('movies'); } } >
        <
        span className = "nav-icon" > 🎬 < /span> <
        span > My Movies({ movies.length }) < /span> <
        /button> <
        button className = { 'nav-item ' + (activeTab === 'bookings' ? 'active' : '') }
        onClick = {
            function() { setActiveTab('bookings'); } } >
        <
        span className = "nav-icon" > 🎫 < /span> <
        span > All Bookings({ bookings.length }) < /span> <
        /button> <
        button className = { 'nav-item ' + (activeTab === 'analytics' ? 'active' : '') }
        onClick = {
            function() { setActiveTab('analytics'); } } >
        <
        span className = "nav-icon" > 📊 < /span> <
        span > Analytics < /span> <
        /button> <
        /nav>

        <
        button className = "logout-btn"
        onClick = { logout } >
        Logout <
        /button> <
        /aside>

        { /* Main Content */ } <
        main className = "owner-main" >
        <
        header className = "dashboard-header" >
        <
        div >
        <
        h1 > Theatre Dashboard < /h1> <
        p className = "dashboard-subtitle" > Manage your movies, shows, and track bookings < /p> <
        /div> <
        button className = "add-movie-btn"
        onClick = {
            function() { setShowAddModal(true); } } >
        +Add New Movie <
        /button> <
        /header>

        { /* Stats Cards */ } <
        div className = "stats-grid" >
        <
        div className = "stat-card" >
        <
        div className = "stat-icon" > 🎬 < /div> <
        div className = "stat-info" >
        <
        h3 > { stats.totalMovies } < /h3> <
        p > Total Movies < /p> <
        /div> <
        /div> <
        div className = "stat-card" >
        <
        div className = "stat-icon" > 🎫 < /div> <
        div className = "stat-info" >
        <
        h3 > { stats.totalBookings } < /h3> <
        p > Total Bookings < /p> <
        /div> <
        /div> <
        div className = "stat-card" >
        <
        div className = "stat-icon" > 💰 < /div> <
        div className = "stat-info" >
        <
        h3 > ₹{ stats.totalRevenue.toLocaleString() } < /h3> <
        p > Total Revenue < /p> <
        /div> <
        /div> <
        div className = "stat-card" >
        <
        div className = "stat-icon" > 💺 < /div> <
        div className = "stat-info" >
        <
        h3 > { stats.totalSeatsSold } < /h3> <
        p > Seats Sold < /p> <
        /div> <
        /div> <
        /div>

        { /* Movies Tab */ } {
            activeTab === 'movies' && ( <
                div className = "movies-section" >
                <
                div className = "section-header" >
                <
                h2 > My Movies < /h2> <
                div className = "movie-count" > { movies.length }
                movies total < /div> <
                /div>

                {
                    loading ? ( <
                        div className = "loading-spinner" >
                        <
                        div className = "spinner" > < /div> <
                        p > Loading movies... < /p> <
                        /div>
                    ) : movies.length === 0 ? ( <
                        div className = "empty-state" >
                        <
                        div className = "empty-icon" > 🎬 < /div> <
                        h3 > No movies added yet < /h3> <
                        p > Start by adding your first movie to the theatre < /p> <
                        button className = "add-movie-btn"
                        onClick = {
                            function() { setShowAddModal(true); } } >
                        +Add Your First Movie <
                        /button> <
                        /div>
                    ) : ( <
                        div className = "movies-grid" > {
                            movies.map(function(movie) {
                                // Calculate bookings for this movie
                                var movieBookings = bookings.filter(function(b) {
                                    return b.movieId && b.movieId._id === movie._id;
                                });
                                var totalSeatsSold = 0;
                                for (var i = 0; i < movieBookings.length; i++) {
                                    totalSeatsSold = totalSeatsSold + movieBookings[i].seats.length;
                                }

                                return ( <
                                    div key = { movie._id }
                                    className = "movie-card" >
                                    <
                                    div className = "movie-poster" >
                                    <
                                    img src = { movie.image }
                                    alt = { movie.name }
                                    /> <
                                    div className = "movie-status-badge" >
                                    <
                                    span className = { 'status ' + movie.status } > { movie.status === 'now-showing' ? 'Now Showing' : 'Upcoming' } <
                                    /span> <
                                    /div> <
                                    /div> <
                                    div className = "movie-details" >
                                    <
                                    h3 className = "movie-name" > { movie.name } < /h3> <
                                    p className = "movie-info" > { movie.language }• { movie.duration } < /p> <
                                    p className = "movie-genre" > { movie.genre } < /p> <
                                    div className = "movie-stats" >
                                    <
                                    div className = "stat-item" >
                                    <
                                    span > 🎫{ movieBookings.length }
                                    bookings < /span> <
                                    span > 💺{ totalSeatsSold }
                                    seats < /span> <
                                    /div> <
                                    /div> <
                                    div className = "movie-price" > Starting₹ { movie.basePrice } < /div> <
                                    div className = "movie-shows" >
                                    <
                                    strong > Show Times: < /strong> <
                                    div className = "shows-list" > {
                                        movie.shows && movie.shows.map(function(show, idx) {
                                            return <span key = { idx }
                                            className = "show-badge" > { show.time } < /span>;
                                        })
                                    } <
                                    /div> <
                                    /div> <
                                    div className = "movie-actions" >
                                    <
                                    button className = "view-btn"
                                    onClick = {
                                        function() { openDetailsModal(movie); } } > 👁️View Details <
                                    /button> <
                                    button className = "edit-btn"
                                    onClick = {
                                        function() { openEditModal(movie); } } > ✏️Edit <
                                    /button> <
                                    button className = "delete-btn"
                                    onClick = {
                                        function() { handleDeleteMovie(movie._id); } } > 🗑️Delete <
                                    /button> <
                                    /div> <
                                    /div> <
                                    /div>
                                );
                            })
                        } <
                        /div>
                    )
                } <
                /div>
            )
        }

        { /* Bookings Tab */ } {
            activeTab === 'bookings' && ( <
                div className = "bookings-section" >
                <
                div className = "section-header" >
                <
                h2 > All Bookings < /h2> <
                div className = "booking-count" > { bookings.length }
                total bookings < /div> <
                /div>

                <
                div className = "bookings-table-container" > {
                    bookings.length === 0 ? ( <
                        div className = "empty-state" >
                        <
                        div className = "empty-icon" > 🎫 < /div> <
                        h3 > No bookings yet < /h3> <
                        p > When customers book tickets, they will appear here < /p> <
                        /div>
                    ) : ( <
                        table className = "bookings-table" >
                        <
                        thead >
                        <
                        tr >
                        <
                        th > Movie < /th> <
                        th > Customer < /th> <
                        th > Show Time < /th> <
                        th > Seats < /th> <
                        th > Amount < /th> <
                        th > Booking Date < /th> <
                        /tr> <
                        /thead> <
                        tbody > {
                            bookings.map(function(booking) {
                                return ( <
                                    tr key = { booking._id } >
                                    <
                                    td > < strong > { booking.movieId && booking.movieId.name } < /strong></td >
                                    <
                                    td > { booking.userId && booking.userId.name } < br / >
                                    <
                                    small > { booking.userId && booking.userId.email } < /small> <
                                    /td> <
                                    td > { booking.showTime } < /td> <
                                    td > { booking.seats.join(', ') } < /td> <
                                    td > < span className = "amount" > ₹{ booking.totalAmount } < /span></td >
                                    <
                                    td > { new Date(booking.bookingDate).toLocaleDateString() } < /td> <
                                    /tr>
                                );
                            })
                        } <
                        /tbody> <
                        /table>
                    )
                } <
                /div> <
                /div>
            )
        }

        { /* Analytics Tab */ } {
            activeTab === 'analytics' && ( <
                div className = "analytics-section" >
                <
                div className = "section-header" >
                <
                h2 > Theatre Analytics < /h2> <
                p > Performance overview of your theatre < /p> <
                /div>

                <
                div className = "analytics-grid" >
                <
                div className = "analytics-card" >
                <
                h3 > Revenue by Movie < /h3> <
                div className = "movie-revenue-list" > {
                    movies.map(function(movie) {
                        var movieBookings = bookings.filter(function(b) {
                            return b.movieId && b.movieId._id === movie._id;
                        });
                        var movieRevenue = 0;
                        for (var i = 0; i < movieBookings.length; i++) {
                            movieRevenue = movieRevenue + movieBookings[i].totalAmount;
                        }
                        var percentage = stats.totalRevenue > 0 ? (movieRevenue / stats.totalRevenue * 100).toFixed(1) : 0;
                        return ( <
                            div key = { movie._id }
                            className = "revenue-item" >
                            <
                            div className = "revenue-info" >
                            <
                            span className = "movie-name" > { movie.name } < /span> <
                            span className = "movie-amount" > ₹{ movieRevenue.toLocaleString() } < /span> <
                            /div> <
                            div className = "progress-bar" >
                            <
                            div className = "progress-fill"
                            style = {
                                { width: percentage + '%' } } > < /div> <
                            /div> <
                            div className = "percentage" > { percentage } % < /div> <
                            /div>
                        );
                    })
                } <
                /div> <
                /div>

                <
                div className = "analytics-card" >
                <
                h3 > Popular Movies < /h3> <
                div className = "popular-movies" > {
                    movies.slice(0, 5).map(function(movie, idx) {
                        var movieBookings = bookings.filter(function(b) {
                            return b.movieId && b.movieId._id === movie._id;
                        });
                        var seatCount = 0;
                        for (var i = 0; i < movieBookings.length; i++) {
                            seatCount = seatCount + movieBookings[i].seats.length;
                        }
                        return ( <
                            div key = { movie._id }
                            className = "popular-item" >
                            <
                            div className = "popular-rank" > #{ idx + 1 } < /div> <
                            div className = "popular-info" >
                            <
                            div className = "popular-name" > { movie.name } < /div> <
                            div className = "popular-stats" >
                            <
                            span > 🎫{ movieBookings.length }
                            bookings < /span> <
                            span > 💺{ seatCount }
                            seats sold < /span> <
                            /div> <
                            /div> <
                            /div>
                        );
                    })
                } <
                /div> <
                /div> <
                /div> <
                /div>
            )
        } <
        /main>

        { /* Movie Details Modal */ } {
            showDetailsModal && viewingMovie && ( <
                div className = "modal-overlay" >
                <
                div className = "modal-container details-modal" >
                <
                div className = "modal-header" >
                <
                h2 > Movie Details < /h2> <
                button className = "close-modal"
                onClick = {
                    function() { setShowDetailsModal(false);
                        setViewingMovie(null); } } > ✕ < /button> <
                /div> <
                div className = "details-content" >
                <
                div className = "details-poster" >
                <
                img src = { viewingMovie.image }
                alt = { viewingMovie.name }
                /> <
                /div> <
                div className = "details-info" >
                <
                h3 > { viewingMovie.name } < /h3> <
                p className = "details-meta" > { viewingMovie.language }• { viewingMovie.duration } < /p> <
                p className = "details-genre" > { viewingMovie.genre } < /p> <
                p className = "details-description" > { viewingMovie.description } < /p> <
                div className = "details-price" > Base Price: ₹{ viewingMovie.basePrice } < /div> <
                div className = "details-status" >
                Status: < span className = { 'status ' + viewingMovie.status } > { viewingMovie.status === 'now-showing' ? 'Now Showing' : 'Upcoming' } <
                /span> <
                /div> <
                div className = "details-shows" >
                <
                strong > Show Times: < /strong> <
                div className = "shows-list" > {
                    viewingMovie.shows && viewingMovie.shows.map(function(show, idx) {
                        return <span key = { idx }
                        className = "show-badge" > { show.time } < /span>;
                    })
                } <
                /div> <
                /div> <
                div className = "details-categories" >
                <
                strong > Seat Categories: < /strong> <
                div className = "categories-list" > {
                    viewingMovie.seatCategories && viewingMovie.seatCategories.map(function(cat, idx) {
                        return ( <
                            div key = { idx }
                            className = "category-badge"
                            style = {
                                { background: cat.color } } > { cat.name } - ₹{ cat.price } <
                            /div>
                        );
                    })
                } <
                /div> <
                /div> <
                /div> <
                /div> <
                /div> <
                /div>
            )
        }

        { /* Add Movie Modal */ } {
            showAddModal && ( <
                div className = "modal-overlay" >
                <
                div className = "modal-container large-modal" >
                <
                div className = "modal-header" >
                <
                h2 > Add New Movie < /h2> <
                button className = "close-modal"
                onClick = {
                    function() { setShowAddModal(false); } } > ✕ < /button> <
                /div> <
                form onSubmit = { handleAddMovie } >
                <
                div className = "form-section" >
                <
                h3 > Basic Information < /h3> <
                div className = "form-row" >
                <
                input type = "text"
                placeholder = "Movie Name"
                value = { newMovie.name }
                onChange = {
                    function(e) { setNewMovie({...newMovie, name: e.target.value }); } }
                required / >
                <
                input type = "text"
                placeholder = "Language"
                value = { newMovie.language }
                onChange = {
                    function(e) { setNewMovie({...newMovie, language: e.target.value }); } }
                required / >
                <
                /div> <
                div className = "form-row" >
                <
                input type = "text"
                placeholder = "Genre"
                value = { newMovie.genre }
                onChange = {
                    function(e) { setNewMovie({...newMovie, genre: e.target.value }); } }
                required / >
                <
                input type = "text"
                placeholder = "Duration (e.g., 2h 30m)"
                value = { newMovie.duration }
                onChange = {
                    function(e) { setNewMovie({...newMovie, duration: e.target.value }); } }
                required / >
                <
                /div> <
                div className = "form-row" >
                <
                input type = "text"
                placeholder = "Image URL"
                value = { newMovie.image }
                onChange = {
                    function(e) { setNewMovie({...newMovie, image: e.target.value }); } }
                required / >
                <
                input type = "number"
                placeholder = "Base Price"
                value = { newMovie.basePrice }
                onChange = {
                    function(e) { setNewMovie({...newMovie, basePrice: e.target.value }); } }
                required / >
                <
                /div> <
                textarea placeholder = "Description"
                value = { newMovie.description }
                onChange = {
                    function(e) { setNewMovie({...newMovie, description: e.target.value }); } }
                rows = "3"
                required / >
                <
                /div>

                <
                div className = "form-section" >
                <
                h3 > Seat Categories & Pricing < /h3> {
                    seatCategories.map(function(category, index) {
                        return ( <
                            div key = { index }
                            className = "category-card" >
                            <
                            div className = "category-header-input" >
                            <
                            input type = "text"
                            placeholder = "Category Name"
                            value = { category.name }
                            onChange = {
                                function(e) { handleCategoryChange(index, 'name', e.target.value); } }
                            required / >
                            <
                            input type = "number"
                            placeholder = "Price (₹)"
                            value = { category.price }
                            onChange = {
                                function(e) { handleCategoryChange(index, 'price', e.target.value); } }
                            required / >
                            <
                            input type = "color"
                            value = { category.color }
                            onChange = {
                                function(e) { handleCategoryChange(index, 'color', e.target.value); } }
                            /> {
                                seatCategories.length > 1 && ( <
                                    button type = "button"
                                    className = "remove-cat-btn"
                                    onClick = {
                                        function() { removeCategory(index); } } > 🗑️ < /button>
                                )
                            } <
                            /div> <
                            div className = "category-rows" >
                            <
                            label > Rows: < /label> <
                            input type = "text"
                            placeholder = "e.g., A,B,C"
                            value = { category.rows.join(',') }
                            onChange = {
                                function(e) {
                                    var rows = e.target.value.split(',').map(function(r) { return r.trim().toUpperCase(); });
                                    handleCategoryChange(index, 'rows', rows);
                                }
                            }
                            required / >
                            <
                            label > Seats / Row: < /label> <
                            input type = "number"
                            placeholder = "Seats per row"
                            value = { category.seatsPerRow }
                            onChange = {
                                function(e) { handleCategoryChange(index, 'seatsPerRow', parseInt(e.target.value)); } }
                            required / >
                            <
                            /div> <
                            /div>
                        );
                    })
                } <
                button type = "button"
                className = "add-cat-btn"
                onClick = { addCategory } > +Add Category < /button> <
                /div>

                <
                div className = "form-section" >
                <
                h3 > Show Times < /h3> {
                    showTimes.map(function(show, index) {
                        return ( <
                            div key = { index }
                            className = "show-time-card" >
                            <
                            input type = "text"
                            placeholder = "Show Time"
                            value = { show.time }
                            onChange = {
                                function(e) { handleShowTimeChange(index, 'time', e.target.value); } }
                            required / > {
                                showTimes.length > 1 && ( <
                                    button type = "button"
                                    className = "remove-show-btn"
                                    onClick = {
                                        function() { removeShowTime(index); } } > Remove < /button>
                                )
                            } <
                            /div>
                        );
                    })
                } <
                button type = "button"
                className = "add-show-btn"
                onClick = { addShowTime } > +Add Show Time < /button> <
                /div>

                <
                div className = "form-section" >
                <
                h3 > Movie Status < /h3> <
                select value = { newMovie.status }
                onChange = {
                    function(e) { setNewMovie({...newMovie, status: e.target.value }); } } >
                <
                option value = "now-showing" > Now Showing < /option> <
                option value = "upcoming" > Upcoming < /option> <
                /select> <
                /div>

                <
                button type = "submit"
                className = "submit-btn"
                disabled = { loading } > { loading ? 'Adding Movie...' : 'Add Movie' } <
                /button> <
                /form> <
                /div> <
                /div>
            )
        }

        { /* Edit Movie Modal */ } {
            showEditModal && editingMovie && ( <
                div className = "modal-overlay" >
                <
                div className = "modal-container" >
                <
                div className = "modal-header" >
                <
                h2 > Edit Movie: { editingMovie.name } < /h2> <
                button className = "close-modal"
                onClick = {
                    function() { setShowEditModal(false);
                        setEditingMovie(null); } } > ✕ < /button> <
                /div> <
                form onSubmit = { handleEditMovie } >
                <
                div className = "form-row" >
                <
                input type = "text"
                placeholder = "Movie Name"
                value = { editingMovie.name }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, name: e.target.value }); } }
                required / >
                <
                input type = "text"
                placeholder = "Language"
                value = { editingMovie.language }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, language: e.target.value }); } }
                required / >
                <
                /div> <
                div className = "form-row" >
                <
                input type = "text"
                placeholder = "Genre"
                value = { editingMovie.genre }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, genre: e.target.value }); } }
                required / >
                <
                input type = "text"
                placeholder = "Duration"
                value = { editingMovie.duration }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, duration: e.target.value }); } }
                required / >
                <
                /div> <
                div className = "form-row" >
                <
                input type = "text"
                placeholder = "Image URL"
                value = { editingMovie.image }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, image: e.target.value }); } }
                required / >
                <
                input type = "number"
                placeholder = "Base Price"
                value = { editingMovie.basePrice }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, basePrice: e.target.value }); } }
                required / >
                <
                /div> <
                textarea placeholder = "Description"
                value = { editingMovie.description }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, description: e.target.value }); } }
                rows = "3"
                required / >

                <
                div className = "form-section" >
                <
                h3 > Show Times < /h3> {
                    editingMovie.shows && editingMovie.shows.map(function(show, idx) {
                        return ( <
                            div key = { idx }
                            className = "show-time-card" >
                            <
                            input type = "text"
                            value = { show.time }
                            onChange = {
                                function(e) {
                                    var updatedShows = [...editingMovie.shows];
                                    updatedShows[idx].time = e.target.value;
                                    setEditingMovie({...editingMovie, shows: updatedShows });
                                }
                            }
                            required / >
                            <
                            button type = "button"
                            className = "remove-show-btn"
                            onClick = {
                                function() {
                                    var updatedShows = [...editingMovie.shows];
                                    updatedShows.splice(idx, 1);
                                    setEditingMovie({...editingMovie, shows: updatedShows });
                                }
                            } > Remove < /button> <
                            /div>
                        );
                    })
                } <
                button type = "button"
                className = "add-show-btn"
                onClick = {
                    function() {
                        var updatedShows = [...(editingMovie.shows || [])];
                        updatedShows.push({ time: 'New Show', date: '', bookedSeats: [] });
                        setEditingMovie({...editingMovie, shows: updatedShows });
                    }
                } > +Add Show Time < /button> <
                /div>

                <
                div className = "form-section" >
                <
                h3 > Status < /h3> <
                select value = { editingMovie.status }
                onChange = {
                    function(e) { setEditingMovie({...editingMovie, status: e.target.value }); } } >
                <
                option value = "now-showing" > Now Showing < /option> <
                option value = "upcoming" > Upcoming < /option> <
                /select> <
                /div>

                <
                button type = "submit"
                className = "submit-btn"
                disabled = { loading } > { loading ? 'Updating...' : 'Update Movie' } <
                /button> <
                /form> <
                /div> <
                /div>
            )
        } <
        /div>
    );
};

export default OwnerDashboard;