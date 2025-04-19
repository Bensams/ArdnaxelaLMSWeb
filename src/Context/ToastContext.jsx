// src/Context/ToastContext.js
import { createContext, useState } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNewMessageAlert = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <ToastContext.Provider value={{ showToast, setShowToast, toastMessage, showNewMessageAlert }}>
      {children}
    </ToastContext.Provider>
  );
};