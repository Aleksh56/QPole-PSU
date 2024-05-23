import ErrorImage from '@assets/404.svg';
import { Box, Container, Typography } from '@mui/material';

import Header from '@/components/04_Widgets/Navigation/Menus/mainHeader';

const NotFoundPage = () => {
  return (
    <Container>
      <Header isMainPage={false} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <img src={ErrorImage} style={{ maxWidth: '500px' }} />
        <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>Такой страницы нет</Typography>
        <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#868686' }}>
          Но есть много других интересных страниц
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
