import useAuth from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');

        if (storedToken) {
          if (isMounted) {
            setIsReady(true);
          }
        } else {
          if (isMounted) {
            setIsReady(true);
          }
        }
      } catch (error) {
        console.error('Error while checking token:', error);
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const location = useLocation();

  return isReady ? (
    isAuthenticated === true ? (
      <Outlet />
    ) : (
      <Navigate to="/signin" state={{ from: location }} replace />
    )
  ) : null;
};
