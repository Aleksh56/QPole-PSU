import React, { useEffect, useState } from 'react';
import { getAllUsersFx } from './models/get-users';
import CustomTable from '@/components/04_Widgets/table';
import BlockIcon from '@mui/icons-material/Block';
import SettingsIcon from '@mui/icons-material/Settings';
import FrmConfirm from '@/components/04_Widgets/frmConfirm';
import { banUserFx } from './models/ban-user';

const AdminUsersPage = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersResponse = await getAllUsersFx();
      setUsers(usersResponse.data.results);
    };
    fetchAllUsers();
  }, []);

  const handleOpenConfirm = (userId) => {
    setIsConfirmOpen(true);
    setUserIdToBlock(userId);
  };

  const handleBlockUser = async () => {
    try {
      const updatedUser = await banUserFx(userIdToBlock);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.user.id === userIdToBlock ? updatedUser : user))
      );
      setIsConfirmOpen(false);
      setUserIdToBlock(null);
    } catch (error) {
      console.error('Ошибка при бане пользователя:', error);
    }
  };

  const handleChangeStatus = (userId) => {
    console.log(`Сменить статус пользователя с ID: ${userId}`);
  };

  const getAdminUsersTableColumns = (handleChangeStatus) => [
    { id: 1, key: 'id', caption: 'ID', render: (_, user) => (user.user.id ? user.user.id : '-') },
    { id: 2, key: 'name', caption: 'Имя', render: (name) => name ?? '-' },
    { id: 3, key: 'email', caption: 'Email' },
    { id: 4, key: 'joining_date', caption: 'Дата вступления' },
    { id: 5, key: 'role', caption: 'Роль', render: (role) => role ?? '-' },
    {
      id: 6,
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
      id: 7,
      key: 'actions',
      caption: 'Действия',
      render: (_, user) => (
        <>
          <BlockIcon
            onClick={() => handleOpenConfirm(user.user.id)}
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
    <>
      <CustomTable columns={getAdminUsersTableColumns(handleChangeStatus)} data={users} />
      <FrmConfirm
        open={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={(e) => handleBlockUser(e)}
      />
    </>
  );
};

export default AdminUsersPage;
