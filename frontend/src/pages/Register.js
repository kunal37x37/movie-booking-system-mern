import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Register.css';

const Register = () => {
        const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            role: 'user'
        });
        const [otp, setOtp] = useState('');
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const [loading, setLoading] = useState(false);
        const [resendTimer, setResendTimer] = useState(0);
        const { register } = useAuth();
        const navigate = useNavigate();

        const handleChange = (e) => {
            setFormData({...formData, [e.target.name]: e.target.value });
            setError('');
        };

        const handleSendOTP = async(e) => {
            e.preventDefault();

            // Validation
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            setLoading(true);
            setError('');

            try {
                const response = await axios.post('http://localhost:5000/api/otp/send-otp', {
                    email: formData.email
                });

                setSuccess('OTP sent to your email! Please check your inbox.');
                setStep(2);

                // Start resend timer
                setResendTimer(60);
                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

            } catch (error) {
                const errorMsg = error.response && error.response.data && error.response.data.message ?
                    error.response.data.message :
                    'Failed to send OTP';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        const handleResendOTP = async() => {
            if (resendTimer > 0) return;

            setLoading(true);
            setError('');

            try {
                const response = await axios.post('http://localhost:5000/api/otp/send-otp', {
                    email: formData.email
                });

                setSuccess('OTP resent successfully!');
                setResendTimer(60);

                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

            } catch (error) {
                const errorMsg = error.response && error.response.data && error.response.data.message ?
                    error.response.data.message :
                    'Failed to resend OTP';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        const handleVerifyOTP = async(e) => {
            e.preventDefault();

            setLoading(true);
            setError('');

            try {
                // Verify OTP
                const verifyResponse = await axios.post('http://localhost:5000/api/otp/verify-otp', {
                    email: formData.email,
                    otp: otp
                });

                if (verifyResponse.status === 200) {
                    // OTP verified, now register user
                    const { confirmPassword, ...registerData } = formData;
                    const result = await register(registerData);

                    if (result.success) {
                        setSuccess('Registration successful! Redirecting...');
                        setTimeout(() => {
                            navigate('/');
                        }, 2000);
                    } else {
                        setError(result.error);
                    }
                }
            } catch (error) {
                const errorMsg = error.response && error.response.data && error.response.data.message ?
                    error.response.data.message :
                    'OTP verification failed';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        const handleBackToForm = () => {
            setStep(1);
            setOtp('');
            setError('');
            setSuccess('');
        };

        return ( <
                div className = "register-page" >
                <
                div className = "register-container" >
                <
                div className = "register-header" >
                <
                div className = "register-brand" > 🎬CineBook < /div> <
                h1 className = "register-title" > { step === 1 ? 'Create Account' : 'Verify Email' } <
                /h1> <
                p className = "register-subtitle" > {
                    step === 1 ?
                    'Join the ultimate movie experience' :
                        `We sent a verification code to ${formData.email}`
                } <
                /p> <
                /div>

                {
                    error && < div className = "error-message" > { error } < /div>} {
                        success && < div className = "success-message" > { success } < /div>}

                        {
                            step === 1 ? ( <
                                form onSubmit = { handleSendOTP }
                                className = "register-form" >
                                <
                                div className = "form-row" >
                                <
                                div className = "form-group" >
                                <
                                input type = "text"
                                name = "name"
                                placeholder = "Full Name"
                                value = { formData.name }
                                onChange = { handleChange }
                                required /
                                >
                                <
                                /div> <
                                div className = "form-group" >
                                <
                                input type = "email"
                                name = "email"
                                placeholder = "Email Address"
                                value = { formData.email }
                                onChange = { handleChange }
                                required /
                                >
                                <
                                /div> <
                                /div>

                                <
                                div className = "form-row" >
                                <
                                div className = "form-group" >
                                <
                                input type = "password"
                                name = "password"
                                placeholder = "Password (min 6 characters)"
                                value = { formData.password }
                                onChange = { handleChange }
                                required /
                                >
                                <
                                /div> <
                                div className = "form-group" >
                                <
                                input type = "password"
                                name = "confirmPassword"
                                placeholder = "Confirm Password"
                                value = { formData.confirmPassword }
                                onChange = { handleChange }
                                required /
                                >
                                <
                                /div> <
                                /div>

                                <
                                div className = "form-row" >
                                <
                                div className = "form-group" >
                                <
                                input type = "tel"
                                name = "phone"
                                placeholder = "Phone Number (Optional)"
                                value = { formData.phone }
                                onChange = { handleChange }
                                /> <
                                /div> <
                                div className = "form-group" >
                                <
                                select name = "role"
                                value = { formData.role }
                                onChange = { handleChange } >
                                <
                                option value = "user" > 🎬Movie Lover(User) < /option> <
                                option value = "owner" > 🏢Theatre Owner < /option> <
                                /select> <
                                /div> <
                                /div>

                                <
                                button type = "submit"
                                className = "register-btn"
                                disabled = { loading } > { loading ? 'Sending OTP...' : 'Sign Up & Verify Email' } <
                                /button> <
                                /form>
                            ) : ( <
                                form onSubmit = { handleVerifyOTP }
                                className = "otp-form" >
                                <
                                div className = "otp-input-container" >
                                <
                                input type = "text"
                                placeholder = "Enter 6-digit OTP"
                                value = { otp }
                                onChange = {
                                    (e) => setOtp(e.target.value) }
                                maxLength = "6"
                                className = "otp-input"
                                required /
                                >
                                <
                                /div>

                                <
                                div className = "otp-actions" >
                                <
                                button type = "submit"
                                className = "verify-btn"
                                disabled = { loading } > { loading ? 'Verifying...' : 'Verify OTP' } <
                                /button>

                                <
                                button type = "button"
                                className = "resend-btn"
                                onClick = { handleResendOTP }
                                disabled = { resendTimer > 0 } >
                                { resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP' } <
                                /button>

                                <
                                button type = "button"
                                className = "back-btn"
                                onClick = { handleBackToForm } >
                                Back to Registration <
                                /button> <
                                /div> <
                                /form>
                            )
                        }

                        {
                            step === 1 && ( <
                                p className = "login-link" >
                                Already have an account ? < Link to = "/login" > Sign In < /Link> <
                                /p>
                            )
                        } <
                        /div> <
                        /div>
                    );
                };

                export default Register;