import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './LandingPage.css';

const LandingPage = () => {
        const navigate = useNavigate();
        const { user } = useAuth();
        const [movies, setMovies] = useState([]);
        const [filteredMovies, setFilteredMovies] = useState([]);
        const [loading, setLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState('');
        const [selectedCity, setSelectedCity] = useState('Mumbai');
        const [selectedLanguage, setSelectedLanguage] = useState('all');
        const [selectedGenre, setSelectedGenre] = useState('all');
        const [selectedStatus, setSelectedStatus] = useState('all');
        const [currentSlide, setCurrentSlide] = useState(0);
        const [showFilters, setShowFilters] = useState(false);

        useEffect(() => {
            fetchMovies();
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % 3);
            }, 5000);
            return () => clearInterval(interval);
        }, []);

        useEffect(() => {
            filterMovies();
        }, [searchTerm, selectedLanguage, selectedGenre, selectedStatus, movies]);

        const fetchMovies = async() => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/movies');
                setMovies(response.data);
                setFilteredMovies(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };

        const filterMovies = () => {
            let filtered = [...movies];

            // Search filter
            if (searchTerm) {
                filtered = filtered.filter(movie =>
                    movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (movie.language && movie.language.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (movie.genre && movie.genre.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            // Language filter
            if (selectedLanguage !== 'all') {
                filtered = filtered.filter(movie =>
                    movie.language && movie.language.toLowerCase().includes(selectedLanguage.toLowerCase())
                );
            }

            // Genre filter
            if (selectedGenre !== 'all') {
                filtered = filtered.filter(movie =>
                    movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
                );
            }

            // Status filter
            if (selectedStatus !== 'all') {
                filtered = filtered.filter(movie => movie.status === selectedStatus);
            }

            setFilteredMovies(filtered);
        };

        const clearFilters = () => {
            setSearchTerm('');
            setSelectedLanguage('all');
            setSelectedGenre('all');
            setSelectedStatus('all');
        };

        const banners = [{
                image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=600&fit=crop",
                title: "Biggest Blockbusters",
                subtitle: "Book your tickets now!"
            },
            {
                image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=600&fit=crop",
                title: "Summer Special Offers",
                subtitle: "Get 20% cashback"
            },
            {
                image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=600&fit=crop",
                title: "Premium Experience",
                subtitle: "Luxury seating available"
            }
        ];

        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

        const languages = ['all', 'Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada'];
        const genres = ['all', 'Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];

        return ( <
                div className = "landing-page" > { /* Navbar */ } <
                nav className = "navbar" >
                <
                div className = "nav-container" >
                <
                div className = "nav-brand"
                onClick = {
                    () => navigate('/')
                } >
                <
                span className = "nav-logo" > 🎬 < /span> <
                span className = "nav-name" > Cine < span className = "text-red" > Book < /span></span >
                <
                /div>

                <
                div className = "nav-menu" >
                <
                a href = "#"
                className = "nav-link" > Movies < /a> <
                a href = "#"
                className = "nav-link" > Theatres < /a> <
                a href = "#"
                className = "nav-link" > Offers < /a> <
                a href = "#"
                className = "nav-link" > Events < /a> < /
                div >

                <
                div className = "nav-actions" >
                <
                div className = "city-selector" >
                <
                span className = "city-icon" > 📍 < /span> <
                select value = { selectedCity }
                onChange = {
                    (e) => setSelectedCity(e.target.value)
                } > {
                    cities.map(city => ( <
                        option key = { city }
                        value = { city } > { city } < /option>
                    ))
                } <
                /select> < /
                div >

                {
                    user ? ( <
                        >
                        <
                        span className = "user-welcome" > Hi, { user.name } < /span> <
                        button className = "nav-btn-dashboard"
                        onClick = {
                            () => navigate(user.role === 'owner' ? '/owner-dashboard' : '/user-dashboard')
                        } >
                        Dashboard <
                        /button> < /
                        >
                    ) : ( <
                        >
                        <
                        button className = "nav-btn-login"
                        onClick = {
                            () => navigate('/login')
                        } > Login < /button> <
                        button className = "nav-btn-signup"
                        onClick = {
                            () => navigate('/register')
                        } > Sign Up < /button> < /
                        >
                    )
                } <
                /div> < /
                div > <
                /nav>

                { /* Hero Carousel */ } <
                section className = "hero-section" >
                <
                div className = "carousel-container" > {
                    banners.map((banner, index) => ( <
                        div key = { index }
                        className = { `carousel-slide ${currentSlide === index ? 'active' : ''}` }
                        style = {
                            { backgroundImage: `url(${banner.image})` }
                        } >
                        <
                        div className = "carousel-overlay" > < /div> <
                        div className = "carousel-content" >
                        <
                        h1 className = "carousel-title" > { banner.title } < /h1> <
                        p className = "carousel-subtitle" > { banner.subtitle } < /p> <
                        button className = "btn-primary"
                        onClick = {
                            () => navigate('/movies')
                        } >
                        Book Now <
                        /button> < /
                        div > <
                        /div>
                    ))
                } <
                div className = "carousel-dots" > {
                    banners.map((_, index) => ( <
                        button key = { index }
                        className = { `dot ${currentSlide === index ? 'active' : ''}` }
                        onClick = {
                            () => setCurrentSlide(index)
                        }
                        />
                    ))
                } <
                /div> < /
                div > <
                /section>

                { /* Search and Filter Section */ } <
                section className = "search-section" >
                <
                div className = "container" >
                <
                div className = "search-card" >
                <
                div className = "search-input-group" >
                <
                input type = "text"
                placeholder = "Search by movie name, language, or genre..."
                className = "search-input"
                value = { searchTerm }
                onChange = {
                    (e) => setSearchTerm(e.target.value)
                }
                /> <
                button className = "filter-toggle-btn"
                onClick = {
                    () => setShowFilters(!showFilters)
                } > { showFilters ? 'Hide Filters ▲' : 'Show Filters ▼' } <
                /button> {
                (searchTerm || selectedLanguage !== 'all' || selectedGenre !== 'all' || selectedStatus !== 'all') && ( <
                    button className = "clear-filters-btn"
                    onClick = { clearFilters } >
                    Clear All✕ <
                    /button>
                )
            } <
            /div>

        {
            showFilters && ( <
                div className = "filters-panel" >
                <
                div className = "filter-group" >
                <
                label > Language < /label> <
                div className = "filter-options" > {
                    languages.map(lang => ( <
                        button key = { lang }
                        className = { `filter-chip ${selectedLanguage === lang ? 'active' : ''}` }
                        onClick = {
                            () => setSelectedLanguage(lang)
                        } > { lang === 'all' ? 'All' : lang } <
                        /button>
                    ))
                } <
                /div> < /
                div >

                <
                div className = "filter-group" >
                <
                label > Genre < /label> <
                div className = "filter-options" > {
                    genres.map(genre => ( <
                        button key = { genre }
                        className = { `filter-chip ${selectedGenre === genre ? 'active' : ''}` }
                        onClick = {
                            () => setSelectedGenre(genre)
                        } > { genre === 'all' ? 'All' : genre } <
                        /button>
                    ))
                } <
                /div> < /
                div >

                <
                div className = "filter-group" >
                <
                label > Status < /label> <
                div className = "filter-options" >
                <
                button className = { `filter-chip ${selectedStatus === 'all' ? 'active' : ''}` }
                onClick = {
                    () => setSelectedStatus('all')
                } >
                All <
                /button> <
                button className = { `filter-chip ${selectedStatus === 'now-showing' ? 'active' : ''}` }
                onClick = {
                    () => setSelectedStatus('now-showing')
                } >
                Now Showing <
                /button> <
                button className = { `filter-chip ${selectedStatus === 'upcoming' ? 'active' : ''}` }
                onClick = {
                    () => setSelectedStatus('upcoming')
                } >
                Upcoming <
                /button> < /
                div > <
                /div> < /
                div >
            )
        } <
        /div> < /
        div > <
            /section>

        { /* Results Count */ } <
        div className = "container" >
            <
            div className = "results-count" >
            <
            span > { filteredMovies.length }
        movies found < /span> {
        filteredMovies.length !== movies.length && ( <
            span className = "filtered-badge" > Filtered < /span>
        )
    } <
    /div> < /
    div >

    { /* Movies Grid */ } <
    section className = "movies-section" >
    <
    div className = "container" > {
        loading ? ( <
            div className = "loading-spinner" >
            <
            div className = "spinner" > < /div> <
            p > Loading movies... < /p> < /
            div >
        ) : filteredMovies.length === 0 ? ( <
            div className = "no-results" >
            <
            div className = "no-results-icon" > 🎬 < /div> <
            h3 > No movies found < /h3> <
            p > Try adjusting your search or filters < /p> <
            button className = "clear-filters-btn"
            onClick = { clearFilters } > Clear all filters < /button> < /
            div >
        ) : ( <
            div className = "movies-grid" > {
                filteredMovies.map((movie) => ( <
                    div key = { movie._id }
                    className = "movie-card"
                    onClick = {
                        () => user ? navigate(`/booking/${movie._id}`) : navigate('/login')
                    } >
                    <
                    div className = "movie-card-image" >
                    <
                    img src = { movie.image }
                    alt = { movie.name }
                    /> <
                    div className = "movie-card-overlay" >
                    <
                    button className = "book-now-btn" > Book Now < /button> < /
                    div > <
                    div className = "movie-rating" >
                    <
                    span className = "star" > ⭐ < /span> <
                    span > 4.5 < /span> < /
                    div > <
                    div className = { `movie-status-tag ${movie.status}` } > { movie.status === 'now-showing' ? 'Now Showing' : 'Upcoming' } <
                    /div> < /
                    div > <
                    div className = "movie-card-info" >
                    <
                    h3 className = "movie-title" > { movie.name } < /h3> <
                    div className = "movie-details-info" >
                    <
                    span > 🕐{ movie.duration } < /span> <
                    span > 🎬{ movie.language } < /span> <
                    span > 🎭{ movie.genre } < /span> < /
                    div > <
                    div className = "movie-price-info" >
                    <
                    span className = "price" > ₹{ movie.basePrice || movie.price } < /span> <
                    span className = "starting-from" > Starting from < /span> < /
                    div > <
                    /div> < /
                    div >
                ))
            } <
            /div>
        )
    } <
    /div> < /
    section >

    { /* Footer */ } <
    footer className = "footer" >
    <
    div className = "container" >
    <
    div className = "footer-grid" >
    <
    div className = "footer-brand" >
    <
    div className = "footer-logo" > 🎬CineBook < /div> <
p > India 's largest movie ticket booking platform with 500+ theatres across 50+ cities.</p> <
div className = "social-links" >
    <
    a href = "#" > 📱 < /a> <
a href = "#" > 📷 < /a> <
a href = "#" > 🐦 < /a> <
a href = "#" > 📺 < /a> < /
    div > <
    /div> <
div className = "footer-links" >
    <
    h4 > Quick Links < /h4> <
ul >
    <
    li > < a href = "#" > About Us < /a></li >
    <
    li > < a href = "#" > Contact < /a></li >
    <
    li > < a href = "#" > FAQs < /a></li >
    <
    li > < a href = "#" > Privacy Policy < /a></li >
    <
    /ul> < /
    div > <
    div className = "footer-links" >
    <
    h4 > Support < /h4> <
ul >
    <
    li > < a href = "#" > 24 / 7 Help Center < /a></li >
    <
    li > < a href = "#" > Cancellation Policy < /a></li >
    <
    li > < a href = "#" > Refund Policy < /a></li >
    <
    li > < a href = "#" > Terms of Use < /a></li >
    <
    /ul> < /
    div > <
    div className = "footer-app" >
    <
    h4 > Download App < /h4> <
button className = "app-btn" > 📱Google Play < /button> <
button className = "app-btn" > 🍎App Store < /button> < /
    div > <
    /div> <
div className = "footer-bottom" >
    <
    p > & copy;
2024 CineBook.All rights reserved. < /p> < /
    div > <
    /div> < /
    footer > <
    /div>
);
};

export default LandingPage;