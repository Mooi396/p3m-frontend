import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default GuestRoute;