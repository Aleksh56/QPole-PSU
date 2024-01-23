import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { useEffect, useState } from 'react';

// export const PrivateRoute = () => {
//   const { isAuthenticated } = useAuth();

//   const location = useLocation();

//   return isAuthenticated === true ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/signin" state={{ from: location }} replace />
//   );
// };

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');

        if (storedToken) {
          if (isMounted) {
            setReady(true);
          }
        } else {
          if (isMounted) {
            setReady(true);
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
