import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
