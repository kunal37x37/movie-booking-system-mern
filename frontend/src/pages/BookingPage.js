import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './BookingPage.css';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [movie, setMovie] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedShow, setSelectedShow] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [availableDates, setAvailableDates] = useState([]);
    const [hoveredSeat, setHoveredSeat] = useState(null);

    useEffect(function() {
        fetchMovie();
        generateDates();
    }, [id]);

    const generateDates = function() {
        var dates = [];
        for (var i = 0; i < 7; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            dates.push({
                date: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dateNum: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            });
        }
        setAvailableDates(dates);
        setSelectedDate(dates[0].date);
    };

    const fetchMovie = async function() {
        try {
            var response = await axios.get('http://localhost:5000/api/movies/' + id);
            setMovie(response.data);
            if (response.data.shows && response.data.shows.length > 0) {
                setSelectedShow(response.data.shows[0].time);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movie:', error);
            setLoading(false);
        }
    };

    const toggleSeat = function(seatId, categoryPrice, categoryName) {
        var seatIndex = -1;
        for (var i = 0; i < selectedSeats.length; i++) {
            if (selectedSeats[i].id === seatId) {
                seatIndex = i;
                break;
            }
        }

        if (seatIndex !== -1) {
            var newSeats = [];
            for (var j = 0; j < selectedSeats.length; j++) {
                if (j !== seatIndex) {
                    newSeats.push(selectedSeats[j]);
                }
            }
            setSelectedSeats(newSeats);
        } else {
            setSelectedSeats([...selectedSeats, { id: seatId, price: categoryPrice, category: categoryName }]);
        }
    };

    const isSeatBooked = function(seatId) {
        if (!movie || !movie.shows) return false;
        var currentShow = null;
        for (var i = 0; i < movie.shows.length; i++) {
            if (movie.shows[i].time === selectedShow) {
                currentShow = movie.shows[i];
                break;
            }
        }
        if (currentShow && currentShow.bookedSeats) {
            return currentShow.bookedSeats.indexOf(seatId) !== -1;
        }
        return false;
    };

    const calculateTotal = function() {
        var total = 0;
        for (var i = 0; i < selectedSeats.length; i++) {
            total = total + selectedSeats[i].price;
        }
        return total;
    };

    const calculateGST = function() {
        return calculateTotal() * 0.18;
    };

    const calculateConvenienceFee = function() {
        return selectedSeats.length * 20;
    };

    const calculateGrandTotal = function() {
        return calculateTotal() + calculateGST() + calculateConvenienceFee();
    };

    const handleProceed = function() {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
        setStep(2);
    };

    const handlePayment = async function() {
        try {
            var bookingData = {
                movieId: id,
                showTime: selectedShow,
                showDate: selectedDate,
                seats: selectedSeats,
                totalAmount: calculateGrandTotal()
            };

            var response = await axios.post('http://localhost:5000/api/bookings', bookingData);
            alert('✓ Booking successful! Total amount: ₹' + response.data.totalAmount);
            navigate('/user-dashboard');
        } catch (error) {
            var errorMsg = 'Booking failed';
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            }
            alert(errorMsg);
        }
    };

    const getSeatTooltip = function(seatId, categoryName, price) {
        return seatId + ' - ' + categoryName + ' - ₹' + price;
    };

    if (loading) return ( <
        div className = "loading-screen" >
        <
        div className = "loader" > < /div> <
        p > Loading theatre layout... < /p> < /
        div >
    );

    if (!movie) return <div className = "error-screen" > Movie not found < /div>;

    var seatCategories = movie.seatCategories || [];

    // Create combined seat map for continuous view
    var allSeatsByRow = {};
    for (var c = 0; c < seatCategories.length; c++) {
        var category = seatCategories[c];
        for (var r = 0; r < category.rows.length; r++) {
            var row = category.rows[r];
            if (!allSeatsByRow[row]) {
                allSeatsByRow[row] = [];
            }
            for (var s = 1; s <= category.seatsPerRow; s++) {
                allSeatsByRow[row].push({
                    id: row + s,
                    price: category.price,
                    category: category.name,
                    color: category.color
                });
            }
        }
    }

    // Get all rows sorted
    var allRows = Object.keys(allSeatsByRow).sort();

    var selectedDateObj = null;
    for (var d = 0; d < availableDates.length; d++) {
        if (availableDates[d].date === selectedDate) {
            selectedDateObj = availableDates[d];
            break;
        }
    }

    return ( <
        div className = "booking-page" > { /* Header */ } <
        div className = "booking-header" >
        <
        button className = "back-btn"
        onClick = {
            function() { navigate(-1); }
        } > ←Back <
        /button> <
        div className = "header-info" >
        <
        h1 className = "movie-title" > { movie.name } < /h1> <
        div className = "movie-meta" >
        <
        span > { movie.language } < /span> <
        span > • < /span> <
        span > { movie.duration } < /span> <
        span > • < /span> <
        span > { movie.genre } < /span> < /
        div > <
        /div> < /
        div >

        { /* Progress */ } <
        div className = "progress-container" >
        <
        div className = { 'progress-step ' + (step >= 1 ? 'active' : '') } >
        <
        div className = "step-circle" > 1 < /div> <
        span > Select Seats < /span> < /
        div > <
        div className = "progress-line" > < /div> <
        div className = { 'progress-step ' + (step >= 2 ? 'active' : '') } >
        <
        div className = "step-circle" > 2 < /div> <
        span > Payment < /span> < /
        div > <
        /div>

        {
            step === 1 ? ( <
                div className = "theatre-container" > { /* Date and Time Selection */ } <
                div className = "selection-panel" >
                <
                div className = "date-section" >
                <
                h3 > Select Date < /h3> <
                div className = "date-grid" > {
                    availableDates.map(function(date) {
                        return ( <
                            button key = { date.date }
                            className = { 'date-card ' + (selectedDate === date.date ? 'active' : '') }
                            onClick = {
                                function() { setSelectedDate(date.date); }
                            } >
                            <
                            div className = "date-day" > { date.day } < /div> <
                            div className = "date-number" > { date.dateNum } < /div> <
                            div className = "date-month" > { date.month } < /div> < /
                            button >
                        );
                    })
                } <
                /div> < /
                div >

                <
                div className = "time-section" >
                <
                h3 > Select Show Time < /h3> <
                div className = "time-grid" > {
                    movie.shows && movie.shows.map(function(show) {
                        return ( <
                            button key = { show.time }
                            className = { 'time-card ' + (selectedShow === show.time ? 'active' : '') }
                            onClick = {
                                function() { setSelectedShow(show.time); }
                            } > { show.time } <
                            /button>
                        );
                    })
                } <
                /div> < /
                div > <
                /div>

                { /* Legend */ } <
                div className = "legend-container" > {
                    seatCategories.map(function(category, idx) {
                        return ( <
                            div key = { idx }
                            className = "legend-item" >
                            <
                            div className = "legend-color"
                            style = {
                                { background: category.color }
                            } > < /div> <
                            span className = "legend-name" > { category.name } < /span> <
                            span className = "legend-price" > ₹{ category.price } < /span> < /
                            div >
                        );
                    })
                } <
                div className = "legend-item" >
                <
                div className = "legend-color booked" > < /div> <
                span > Booked < /span> < /
                div > <
                div className = "legend-item" >
                <
                div className = "legend-color selected" > < /div> <
                span > Selected < /span> < /
                div > <
                /div>

                { /* Screen */ } <
                div className = "screen-wrapper" >
                <
                div className = "screen" > SCREEN < /div> < /
                div >

                { /* Theatre Seats Layout - Continuous View */ } <
                div className = "theatre-layout" > {
                    allRows.map(function(row) {
                        var seatsInRow = allSeatsByRow[row] || [];
                        return ( <
                            div key = { row }
                            className = "theatre-row" >
                            <
                            div className = "row-label" > { row } < /div> <
                            div className = "seats-container" > {
                                seatsInRow.map(function(seat) {
                                    var isBooked = isSeatBooked(seat.id);
                                    var isSelected = false;
                                    for (var s = 0; s < selectedSeats.length; s++) {
                                        if (selectedSeats[s].id === seat.id) {
                                            isSelected = true;
                                            break;
                                        }
                                    }
                                    var isHovered = hoveredSeat === seat.id;
                                    return ( <
                                        button key = { seat.id }
                                        className = { 'theatre-seat ' + (isSelected ? 'selected' : '') + (isBooked ? 'booked' : '') }
                                        style = {
                                            { background: isSelected ? '#10b981' : (isBooked ? '#dc2626' : seat.color) }
                                        }
                                        onMouseEnter = {
                                            function() { setHoveredSeat(seat.id); }
                                        }
                                        onMouseLeave = {
                                            function() { setHoveredSeat(null); }
                                        }
                                        onClick = {
                                            function() { if (!isBooked) toggleSeat(seat.id, seat.price, seat.category); }
                                        }
                                        disabled = { isBooked }
                                        title = { getSeatTooltip(seat.id, seat.category, seat.price) } > { seat.id.split('').pop() } <
                                        /button>
                                    );
                                })
                            } <
                            /div> < /
                            div >
                        );
                    })
                } <
                /div>

                { /* Booking Summary Bar */ } <
                div className = "booking-bar" >
                <
                div className = "booking-info" >
                <
                div className = "info-item" >
                <
                span className = "label" > Selected Seats: < /span> <
                span className = "value" > {
                    selectedSeats.length > 0 ? (function() {
                        var ids = [];
                        for (var i = 0; i < selectedSeats.length; i++) {
                            ids.push(selectedSeats[i].id);
                        }
                        return ids.join(', ');
                    })() : 'None'
                } <
                /span> < /
                div > <
                div className = "info-item" >
                <
                span className = "label" > Tickets: < /span> <
                span className = "value" > { selectedSeats.length } < /span> < /
                div > <
                div className = "info-item" >
                <
                span className = "label" > Total: < /span> <
                span className = "value price" > ₹{ calculateTotal() } < /span> < /
                div > <
                /div> <
                button className = "proceed-button"
                onClick = { handleProceed } >
                Continue to Payment→ <
                /button> < /
                div > <
                /div>
            ) : ( <
                div className = "payment-container" >
                <
                div className = "payment-card" >
                <
                h2 > Payment Summary < /h2>

                <
                div className = "summary-details" >
                <
                div className = "summary-row" >
                <
                span > Movie: < /span> <
                strong > { movie.name } < /strong> < /
                div > <
                div className = "summary-row" >
                <
                span > Date & Time: < /span> <
                strong > { selectedDateObj ? selectedDateObj.fullDate : selectedDate } | { selectedShow } < /strong> < /
                div > <
                div className = "summary-row" >
                <
                span > Seats: < /span> <
                strong > {
                    function() {
                        var ids = [];
                        for (var i = 0; i < selectedSeats.length; i++) {
                            ids.push(selectedSeats[i].id + ' (' + selectedSeats[i].category + ')');
                        }
                        return ids.join(', ');
                    }()
                } <
                /strong> < /
                div > <
                /div>

                <
                div className = "price-breakdown" >
                <
                div className = "breakdown-row" >
                <
                span > Ticket Price({ selectedSeats.length }
                    seats) < /span> <
                span > ₹{ calculateTotal() } < /span> < /
                div > <
                div className = "breakdown-row" >
                <
                span > GST(18 % ) < /span> <
                span > ₹{ calculateGST().toFixed(2) } < /span> < /
                div > <
                div className = "breakdown-row" >
                <
                span > Convenience Fee < /span> <
                span > ₹{ calculateConvenienceFee() } < /span> < /
                div > <
                div className = "breakdown-row total" >
                <
                span > Grand Total < /span> <
                span > ₹{ calculateGrandTotal().toFixed(2) } < /span> < /
                div > <
                /div>

                <
                div className = "payment-methods" >
                <
                h3 > Payment Method < /h3> <
                div className = "methods-grid" >
                <
                label className = { 'method ' + (paymentMethod === 'card' ? 'active' : '') } >
                <
                input type = "radio"
                name = "payment"
                value = "card"
                checked = { paymentMethod === 'card' }
                onChange = {
                    function(e) { setPaymentMethod(e.target.value); }
                }
                /> <
                div className = "method-icon" > 💳 < /div> <
                div className = "method-name" > Credit / Debit Card < /div> < /
                label > <
                label className = { 'method ' + (paymentMethod === 'upi' ? 'active' : '') } >
                <
                input type = "radio"
                name = "payment"
                value = "upi"
                checked = { paymentMethod === 'upi' }
                onChange = {
                    function(e) { setPaymentMethod(e.target.value); }
                }
                /> <
                div className = "method-icon" > 📱 < /div> <
                div className = "method-name" > UPI < /div> < /
                label > <
                label className = { 'method ' + (paymentMethod === 'netbanking' ? 'active' : '') } >
                <
                input type = "radio"
                name = "payment"
                value = "netbanking"
                checked = { paymentMethod === 'netbanking' }
                onChange = {
                    function(e) { setPaymentMethod(e.target.value); }
                }
                /> <
                div className = "method-icon" > 🏦 < /div> <
                div className = "method-name" > Net Banking < /div> < /
                label > <
                /div> < /
                div >

                <
                button className = "pay-button"
                onClick = { handlePayment } >
                Pay₹ { calculateGrandTotal().toFixed(2) } <
                /button> < /
                div > <
                /div>
            )
        } <
        /div>
    );
};

export default BookingPage;