import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
        }
        setLoading(false);
    }, [token]);

    const login = async(email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message ?
                error.response.data.message :
                'Login failed';
            return { success: false, error: errorMessage };
        }
    };

    const register = async(userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message ?
                error.response.data.message :
                'Registration failed';
            return { success: false, error: errorMessage };
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return ( <
        AuthContext.Provider value = {
            { user, login, register, logout, loading }
        } > { children } <
        /AuthContext.Provider>
    );
};