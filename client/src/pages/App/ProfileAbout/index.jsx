import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Container,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProfileAboutPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Иван Иванов');
  const [email, setEmail] = useState('ivanov@example.com');
  const [phone, setPhone] = useState('+7 (900) 123-45-67');

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', right: 8, top: 8 }}
        onClick={() => navigate('/app')}
      >
        <CloseIcon />
      </IconButton>
      <Box
        sx={{
          maxWidth: '580px',
          margin: '0 auto',
          padding: '50px 20px 0 20px',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontSize: '24px' }}
          gutterBottom
        >
          Профиль
        </Typography>
        <Avatar
          sx={{
            width: 90,
            height: 90,
            marginTop: '24px',
            '&:hover': {
              opacity: 0.7,
              cursor: 'pointer',
            },
          }}
          src="/path/to/anonymous-avatar.png"
          alt="Анонимный профиль"
        />
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ marginTop: '48px', fontSize: '18px', lineHeight: '24px' }}
        >
          Данные аккаунта
        </Typography>
        <Box
          sx={{
            marginTop: '12px',
            marginBottom: '10px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow:
              '0px 1px 3px rgba(140,148,155,0.1),0px 5px 10px rgba(140,148,155,0.08)',
            borderRadius: '10px',
          }}
        >
          <Box
            sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '15px' }}
          >
            <Box sx={{ display: 'grid' }}>
              <Typography variant="body1" gutterBottom>
                Имя
              </Typography>
              <TextField
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'grid' }}>
              <Typography variant="body1" gutterBottom>
                Эл. почта
              </Typography>
              <TextField
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'grid' }}>
              <Typography variant="body1" gutterBottom>
                Телефон
              </Typography>
              <TextField
                placeholder="Введите номер телефона"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileAboutPage;
