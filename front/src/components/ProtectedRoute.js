import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // 🔒 Redirection vers la page de connexion si pas connecté
    return <Navigate to="/SignIn" replace />;
  }

  return children;
};

export default ProtectedRoute;
