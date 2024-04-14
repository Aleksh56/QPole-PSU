import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useUserData from '@/hooks/useUserData';

const FrmFeedback = () => {
  const userData = useUserData();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (userData) setEmail(userData.email);
  }, [userData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!type || !email || message.length < 10) {
      alert(
        'Пожалуйста, заполните обязательные поля и убедитесь, что сообщение содержит минимум 10 символов.'
      );
      return;
    }

    const formData = {
      type,
      email,
      fullName,
      message,
    };

    console.log(formData);

    alert('Обращение отправлено успешно!');
    // Очистка формы
    setType('');
    setFullName('');
    setMessage('');
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        select
        label="Тип обращения"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        fullWidth
        margin="normal"
      >
        <MenuItem value="complaint">Жалоба</MenuItem>
        <MenuItem value="suggestion">Предложение</MenuItem>
        <MenuItem value="question">Вопрос</MenuItem>
      </TextField>
      <TextField
        label="Электронная почта"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="ФИО"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        fullWidth
        margin="normal"
        multiline
        rows={4}
        inputProps={{ minLength: 10 }}
      />
      <Button type="submit" variant="contained" startIcon={<SendIcon />} sx={{ mt: 2 }}>
        Отправить
      </Button>
    </Box>
  );
};

export default FrmFeedback;
