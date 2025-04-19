// src/components/AutoLogout.jsx
import { useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const inactivityTimeout = 10 * 60 * 1000; // 15 minutes (fixed from original 1 minute)

  useEffect(() => {
    // Only set up the timer if user is logged in (token exists)
    if (!token) return;

    let inactivityTimer;

    const resetTimer = () => {
      // Update last active time in localStorage
      localStorage.setItem('lastActiveTime', Date.now().toString());
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutUser, inactivityTimeout);
    };

    const logoutUser = () => {
      localStorage.removeItem('lastActiveTime');
      logout();
      navigate('/login');
      alert('You have been logged out due to inactivity');
    };

    const checkOtherTabs = (e) => {
      if (e.key === 'lastActiveTime') {
        resetTimer();
      }
    };

    // Check if there's existing inactivity time
    const lastActiveTime = localStorage.getItem('lastActiveTime');
    if (lastActiveTime) {
      const elapsedTime = Date.now() - parseInt(lastActiveTime, 10);
      if (elapsedTime > inactivityTimeout) {
        logoutUser();
        return;
      }
    }

    // Set initial timer
    resetTimer();

    // Event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Listen for storage events (other tabs)
    window.addEventListener('storage', checkOtherTabs);

    // Clean up
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      window.removeEventListener('storage', checkOtherTabs);
    };
  }, [token, logout, navigate]); // Added token to dependency array

  return null;
};

export default AutoLogout;