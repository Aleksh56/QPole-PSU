import { useUserRole } from '@app/context/UserRoleProvider';
import { useEffect, useState } from 'react';

import useAuth from './useAuth';

import { handleRequest } from '@/api/api';

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const { setUserRole } = useUserRole();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      if (!isAuthenticated) {
        console.log('Пользователь не аутентифицирован');
        return;
      }

      try {
        const headers = {
          Authorization: `Token ${token}`,
        };
        const { data } = await handleRequest('get', '/api/my_profile/', null, headers);
        setUserRole(data.role);
        setUserData(data);
      } catch (error) {
        setUserData({});
      }
    }

    fetchUserData();
  }, []);

  return userData;
};

export default useUserData;
