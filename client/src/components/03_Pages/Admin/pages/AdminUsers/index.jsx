import React, { useEffect, useState } from 'react';
import { getAllUsersFx } from './models/get-users';
import CustomTable from '@/components/04_Widgets/table';
// import { getAdminUsersTableColumns } from '@/data/fields';
import BlockIcon from '@mui/icons-material/Block';
import SettingsIcon from '@mui/icons-material/Settings';

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

  const getAdminUsersTableColumns = (handleBlockUser, handleChangeStatus) => [
    { id: 1, key: 'id', caption: 'ID' },
    { id: 2, key: 'name', caption: 'Имя', render: (name) => name ?? '-' },
    { id: 3, key: 'email', caption: 'Email' },
    { id: 4, key: 'role', caption: 'Роль', render: (role) => role ?? '-' },
    {
      id: 5,
      key: 'is_banned',
      caption: 'Статус',
      render: (isBanned) => (
        <span
          style={{
            color: isBanned ? '#EF3826' : '#00B69B',
            backgroundColor: isBanned ? 'rgba(239, 56, 38, .2)' : 'rgba(0, 182, 155, .3)',
            padding: '6px 16px',
            borderRadius: '5px',
            fontWeight: 500,
          }}
        >
          {isBanned ? 'Заблокирован' : 'Активен'}
        </span>
      ),
    },
    {
      id: 6,
      key: 'actions',
      caption: 'Действия',
      render: (_, user) => (
        <>
          <BlockIcon
            onClick={() => handleBlockUser(user.id)}
            color="error"
            sx={{ cursor: 'pointer' }}
          />
          <SettingsIcon
            onClick={() => handleChangeStatus(user.id)}
            sx={{ ml: 1, cursor: 'pointer' }}
          />
        </>
      ),
    },
  ];

  return (
    <CustomTable
      columns={getAdminUsersTableColumns(handleBlockUser, handleChangeStatus)}
      data={users}
    />
  );
};

export default AdminUsersPage;
