import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const { login } = useAuth();
        const navigate = useNavigate();

        const handleSubmit = async(e) => {
            e.preventDefault();
            setLoading(true);
            setError('');

            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        return ( <
            div className = "login-page" >
            <
            div className = "login-container" >
            <
            div className = "login-left" >
            <
            div className = "login-brand" > 🎬CineBook < /div> <
            h1 className = "login-title" > Welcome Back! < /h1> <
            p className = "login-subtitle" > Sign in to
            continue your cinematic journey < /p> <
            form onSubmit = { handleSubmit }
            className = "login-form" > {
                error && < div className = "error-message" > { error } < /div>} <
                div className = "input-group" >
                <
                input
                type = "email"
                placeholder = "Email Address"
                value = { email }
                onChange = {
                    (e) => setEmail(e.target.value) }
                required /
                >
                <
                /div> <
                div className = "input-group" >
                <
                input
                type = "password"
                placeholder = "Password"
                value = { password }
                onChange = {
                    (e) => setPassword(e.target.value) }
                required /
                >
                <
                /div> <
                button type = "submit"
                className = "login-btn"
                disabled = { loading } > { loading ? 'Logging in...' : 'Sign In' } <
                /button> <
                /form> <
                p className = "register-link" >
                Don 't have an account? <Link to="/register">Sign Up</Link> <
                /p> <
                /div> <
                div className = "login-right" >
                <
                div className = "login-quote" >
                <
                p > "Movies are a reflection of life's magic" < /p> <
                span > -CineBook < /span> <
                /div> <
                /div> <
                /div> <
                /div>
            );
        };

        export default Login;