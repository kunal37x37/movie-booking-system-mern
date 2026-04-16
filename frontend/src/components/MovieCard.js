import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return ( <
        div className = "movie-card"
        onClick = {
            () => user ? navigate(`/booking/${movie._id}`) : navigate('/login') } >
        <
        div className = "movie-card-image" >
        <
        img src = { movie.image }
        alt = { movie.name }
        /> <
        div className = "movie-card-overlay" >
        <
        button className = "book-now-btn" > Book Now < /button> <
        /div> <
        div className = "movie-rating" >
        <
        span className = "star" > ⭐ < /span> <
        span > 4.5 < /span> <
        /div> <
        /div> <
        div className = "movie-card-info" >
        <
        h3 className = "movie-title" > { movie.name } < /h3> <
        div className = "movie-details" >
        <
        span > 🕐{ movie.duration } < /span> <
        span > 🎬{ movie.language } < /span> <
        /div> <
        div className = "movie-price" >
        <
        span className = "price" > ₹{ movie.price } < /span> <
        span className = "starting-from" > Starting from < /span> <
        /div> <
        /div> <
        /div>
    );
};

export default MovieCard;