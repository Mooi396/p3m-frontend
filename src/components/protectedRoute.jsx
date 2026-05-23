import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Typography } from "@material-tailwind/react";
import { GetMe } from '../features/authSlice'; 

const ProtectedRoute = () => {
  const { user, isLoading, isError } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/masuk" state={{ from: location }} replace />;
  }
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 text-blue-500" />
          <Typography variant="h6" color="blue-gray">
            Memverifikasi sesi...
          </Typography>
        </div>
      </div>
    );
  }
  if (isError) {
    localStorage.removeItem("token");
    return <Navigate to="/masuk" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;