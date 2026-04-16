import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import BookingPage from './pages/BookingPage';
import './App.css';

function App() {
    return ( <
        AuthProvider >
        <
        Router >
        <
        Routes >
        <
        Route path = "/"
        element = { < LandingPage / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        /> <
        Route path = "/user-dashboard"
        element = { < UserDashboard / > }
        /> <
        Route path = "/owner-dashboard"
        element = { < OwnerDashboard / > }
        /> <
        Route path = "/booking/:id"
        element = { < BookingPage / > }
        /> <
        /Routes> <
        /Router> <
        /AuthProvider>
    );
}

export default App;