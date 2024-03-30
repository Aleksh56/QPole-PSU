import { useState, useEffect } from 'react';
import { handleRequest } from '@/api/api';
import useAuth from './useAuth';
import { useUserRole } from '@/app/context/UserRoleProvider';

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const { setUserRole } = useUserRole();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      if (!isAuthenticated) {
        console.log('Пользователь не аутентифицирован'); // ToDo - rewrite to Notification Snackbar
        return;
      }

      try {
        const headers = {
          Authorization: `Token ${token}`,
        };
        const { data } = await handleRequest(
          'get',
          '/api/my_profile/',
          null,
          'Загрузка данных профиля', // ToDo - Delete (Just for debugging)
          headers
        );
        setUserRole(data.profile.role);
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
