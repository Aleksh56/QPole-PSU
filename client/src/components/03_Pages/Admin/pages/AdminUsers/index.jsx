import React, { useEffect, useState } from 'react';
import { getAllUsersFx } from './models/get-users';
import { getAdminUsersTableColumns } from '@/data/fields';
import CustomTable from '@/components/04_Widgets/table';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersResponse = await getAllUsersFx();
      setUsers(usersResponse.data.results);
    };
    fetchAllUsers();
  }, []);

  const handleBlockUser = (userId) => {
    console.log(`Блокировать пользователя с ID: ${userId}`);
  };

  const handleChangeStatus = (userId) => {
    console.log(`Сменить статус пользователя с ID: ${userId}`);
  };

  return (
    <CustomTable
      columns={getAdminUsersTableColumns(handleBlockUser, handleChangeStatus)}
      data={users}
    />
  );
};

export default AdminUsersPage;
