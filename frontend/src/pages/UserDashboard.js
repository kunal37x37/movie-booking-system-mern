import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalSpent: 0,
        moviesWatched: 0
    });

    useEffect(function() {
        fetchBookings();
    }, []);

    const fetchBookings = async function() {
        try {
            const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
            setBookings(response.data);

            var total = response.data.length;
            var spent = 0;
            var movieIds = [];

            for (var i = 0; i < response.data.length; i++) {
                spent = spent + response.data[i].totalAmount;
                if (response.data[i].movieId && response.data[i].movieId._id) {
                    if (movieIds.indexOf(response.data[i].movieId._id) === -1) {
                        movieIds.push(response.data[i].movieId._id);
                    }
                }
            }

            setStats({
                totalBookings: total,
                totalSpent: spent,
                moviesWatched: movieIds.length
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    var upcomingBookings = [];
    var pastBookings = [];
    var currentDate = new Date();

    for (var i = 0; i < bookings.length; i++) {
        var bookingDate = new Date(bookings[i].bookingDate);
        if (bookingDate > currentDate) {
            upcomingBookings.push(bookings[i]);
        } else {
            pastBookings.push(bookings[i]);
        }
    }

    var userName = user && user.name ? user.name : 'User';
    var userEmail = user && user.email ? user.email : '';
    var userAvatar = userName.charAt(0).toUpperCase();

    return ( <
        div className = "user-dashboard" >
        <
        aside className = "dashboard-sidebar" >
        <
        div className = "sidebar-header" >
        <
        div className = "user-avatar" > { userAvatar } < /div> <
        h3 className = "user-name" > { userName } < /h3> <
        p className = "user-email" > { userEmail } < /p> <
        span className = "user-badge" > { user && user.role === 'owner' ? 'Theatre Owner' : 'Movie Lover' } < /span> <
        /div>

        <
        nav className = "sidebar-nav" >
        <
        button className = { 'nav-item ' + (activeTab === 'upcoming' ? 'active' : '') }
        onClick = {
            function() { setActiveTab('upcoming'); } } >
        <
        span className = "nav-icon" > 🎬 < /span> <
        span > Upcoming Shows < /span> <
        /button> <
        button className = { 'nav-item ' + (activeTab === 'past' ? 'active' : '') }
        onClick = {
            function() { setActiveTab('past'); } } >
        <
        span className = "nav-icon" > 📜 < /span> <
        span > Booking History < /span> <
        /button> <
        button className = { 'nav-item ' + (activeTab === 'stats' ? 'active' : '') }
        onClick = {
            function() { setActiveTab('stats'); } } >
        <
        span className = "nav-icon" > 📊 < /span> <
        span > My Stats < /span> <
        /button> <
        /nav>

        <
        button className = "logout-btn"
        onClick = { logout } > Logout < /button> <
        /aside>

        <
        main className = "dashboard-main" >
        <
        header className = "dashboard-header" >
        <
        h1 > My Dashboard < /h1> <
        button className = "book-movie-btn"
        onClick = {
            function() { navigate('/'); } } >
        +Book Movie <
        /button> <
        /header>

        <
        div className = "stats-grid" >
        <
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
        h3 > ₹{ stats.totalSpent } < /h3> <
        p > Total Spent < /p> <
        /div> <
        /div> <
        div className = "stat-card" >
        <
        div className = "stat-icon" > 🎬 < /div> <
        div className = "stat-info" >
        <
        h3 > { stats.moviesWatched } < /h3> <
        p > Movies Watched < /p> <
        /div> <
        /div> <
        div className = "stat-card" >
        <
        div className = "stat-icon" > ⭐ < /div> <
        div className = "stat-info" >
        <
        h3 > 4.8 < /h3> <
        p > Avg Rating < /p> <
        /div> <
        /div> <
        /div>

        {
            activeTab === 'upcoming' && ( <
                div className = "bookings-section" >
                <
                h2 > Upcoming Shows < /h2> {
                    upcomingBookings.length === 0 ? ( <
                        div className = "empty-state" >
                        <
                        div className = "empty-icon" > 🎬 < /div> <
                        p > No upcoming shows < /p> <
                        button className = "book-now-btn"
                        onClick = {
                            function() { navigate('/'); } } > Book Now < /button> <
                        /div>
                    ) : ( <
                        div className = "bookings-list" > {
                            upcomingBookings.map(function(booking) {
                                return ( <
                                    div key = { booking._id }
                                    className = "booking-card" >
                                    <
                                    div className = "booking-poster" >
                                    <
                                    img src = { booking.movieId && booking.movieId.image }
                                    alt = { booking.movieId && booking.movieId.name }
                                    /> <
                                    /div> <
                                    div className = "booking-details" >
                                    <
                                    h3 > { booking.movieId && booking.movieId.name } < /h3> <
                                    div className = "booking-meta" >
                                    <
                                    span > 📅{ new Date(booking.bookingDate).toLocaleDateString() } < /span> <
                                    span > 🕐{ booking.showTime } < /span> <
                                    span > 💺Seats: { booking.seats.join(', ') } < /span> <
                                    /div> <
                                    div className = "booking-price" > ₹{ booking.totalAmount } < /div> <
                                    /div> <
                                    div className = "booking-status" >
                                    <
                                    span className = "status confirmed" > ✓Confirmed < /span> <
                                    button className = "download-ticket" > Download Ticket < /button> <
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

        {
            activeTab === 'past' && ( <
                div className = "bookings-section" >
                <
                h2 > Booking History < /h2> {
                    pastBookings.length === 0 ? ( <
                        div className = "empty-state" >
                        <
                        div className = "empty-icon" > 📜 < /div> <
                        p > No past bookings < /p> <
                        /div>
                    ) : ( <
                        div className = "bookings-list" > {
                            pastBookings.map(function(booking) {
                                return ( <
                                    div key = { booking._id }
                                    className = "booking-card past" >
                                    <
                                    div className = "booking-poster" >
                                    <
                                    img src = { booking.movieId && booking.movieId.image }
                                    alt = { booking.movieId && booking.movieId.name }
                                    /> <
                                    /div> <
                                    div className = "booking-details" >
                                    <
                                    h3 > { booking.movieId && booking.movieId.name } < /h3> <
                                    div className = "booking-meta" >
                                    <
                                    span > 📅{ new Date(booking.bookingDate).toLocaleDateString() } < /span> <
                                    span > 🕐{ booking.showTime } < /span> <
                                    span > 💺Seats: { booking.seats.join(', ') } < /span> <
                                    /div> <
                                    div className = "booking-price" > ₹{ booking.totalAmount } < /div> <
                                    /div> <
                                    div className = "booking-status" >
                                    <
                                    span className = "status completed" > ✓Completed < /span> <
                                    button className = "rate-btn" > Rate Movie < /button> <
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
        } <
        /main> <
        /div>
    );
};

export default UserDashboard;