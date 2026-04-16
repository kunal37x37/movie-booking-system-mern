import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return ( <
        nav className = "navbar" >
        <
        div className = "nav-container" >
        <
        div className = "nav-brand"
        onClick = {
            () => navigate('/') } >
        <
        span className = "nav-logo" > 🎬 < /span> <
        span className = "nav-name" > Cine < span className = "text-red" > Book < /span></span >
        <
        /div>

        <
        div className = { `nav-menu ${mobileMenuOpen ? 'active' : ''}` } >
        <
        a href = "#"
        className = "nav-link" > Movies < /a> <
        a href = "#"
        className = "nav-link" > Theatres < /a> <
        a href = "#"
        className = "nav-link" > Offers < /a> <
        a href = "#"
        className = "nav-link" > Events < /a> <
        /div>

        <
        div className = "nav-actions" > {
            user ? ( <
                >
                <
                button className = "nav-btn-dashboard"
                onClick = {
                    () => navigate(user.role === 'owner' ? '/owner-dashboard' : '/user-dashboard') } >
                Dashboard <
                /button> <
                button className = "nav-btn-logout"
                onClick = { logout } >
                Logout <
                /button> <
                />
            ) : ( <
                >
                <
                button className = "nav-btn-login"
                onClick = {
                    () => navigate('/login') } >
                Login <
                /button> <
                button className = "nav-btn-signup"
                onClick = {
                    () => navigate('/register') } >
                Sign Up <
                /button> <
                />
            )
        } <
        button className = "mobile-menu-btn"
        onClick = {
            () => setMobileMenuOpen(!mobileMenuOpen) } >
        ☰
        <
        /button> <
        /div> <
        /div> <
        /nav>
    );
};

export default Navbar;