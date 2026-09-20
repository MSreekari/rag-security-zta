import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const token = user?.token || localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* Login / Identity Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Chat Workspace */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}