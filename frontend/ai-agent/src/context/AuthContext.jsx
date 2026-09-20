import React, { createContext, useState } from 'react';

// Keep this internal (do not export it)
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    const login = (userData) => {
        setAuth(userData); // Saves: { name, pass, role }
    };

    const logout = () => setAuth(null);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};