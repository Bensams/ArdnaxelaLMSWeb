import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';
import membersAPI from '../api/members';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            const response = await authAPI.login({
                username,
                password
            });
            
            const { token } = response.data;
            localStorage.setItem('authToken', token);
            setToken(token);
            
            // Fetch user details after successful login
            await fetchUserProfile();
            
            navigate('/');
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || error.message || 'Login failed' 
            };
        }
    };

    // Fetch user profile when token changes
    const fetchUserProfile = async () => {
        try {
            if (token) {
                const response = await membersAPI.getProfile();
                setUser(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Optional: handle error (e.g., logout if token is invalid)
            logout();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    // Initialize axios defaults and fetch user profile
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUserProfile(); // Fetch user details when token is available
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const signup = async (signupData) => {
        try {
            const response = await authAPI.signup(signupData);
            return { success: true, message: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data || 'Signup failed' };
        }
    };

    const isLoggedIn = () => {
        return token != null;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);  
        navigate('/login');
    };

    // Add a function to manually refresh user profile if needed
    const refreshUserProfile = async () => {
        if (token) {
            await fetchUserProfile();
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading,
            login, 
            signup,
            isLoggedIn,
            logout,
            refreshUserProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);