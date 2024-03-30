import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const usersData = [
  {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    status: 'Активен',
    role: 'Преподаватель',
  },
  { id: 2, name: 'Петр Петров', email: 'petr@example.com', status: 'Активен', role: 'Студент' },
  {
    id: 3,
    name: 'Сидр Сидоров',
    email: 'sidr@example.com',
    status: 'Заблокирован',
    role: 'Модератор',
  },
];

const AdminUsersPage = () => {
  const handleBlockUser = (userId) => {
    console.log(`Блокировать пользователя с ID: ${userId}`);
  };

  const handleChangeStatus = (userId) => {
    console.log(`Сменить статус пользователя с ID: ${userId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="таблица пользователей">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user) => (
            <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Button onClick={() => handleBlockUser(user.id)} variant="outlined" color="error">
                  Заблокировать
                </Button>
                <Button
                  onClick={() => handleChangeStatus(user.id)}
                  variant="outlined"
                  sx={{ ml: 1 }}
                >
                  Сменить статус
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminUsersPage;
