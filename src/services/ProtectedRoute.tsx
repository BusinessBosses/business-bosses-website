// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/store/store';
import RoutesPath from '../constants/Routes';
import { StorageEnum } from '../common/emums/StorageEmuns';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  // Example: you keep your token in localStorage *and* mirror auth state in Redux
  const lsToken = localStorage.getItem(StorageEnum.AccessToken);

  const isAuthenticated = Boolean(lsToken);

  if (!isAuthenticated) {
    console.log('Not Authenticated:');
    
    // Redirect to login, but keep where they wanted to go
    return (
      <Navigate
        to={RoutesPath.login}
        replace
        state={{ from: location }}
      />
    );
  }
  console.log(' Authenticated:');
  

  // If they are authed, render the matching child routes
  return <Outlet />;
};

export default ProtectedRoute;
