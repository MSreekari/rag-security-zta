import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id');
    const department = localStorage.getItem('department');
    const clearance = localStorage.getItem('clearance');

    if (token && user_id) {
      return {
        user_id,
        department: department || 'general',
        clearance: Number(clearance) || 1,
        token,
      };
    }
    return null;
  });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};