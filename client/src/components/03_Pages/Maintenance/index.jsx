import TechWorks from '@assets/works.svg';
import { Box, Container, Typography } from '@mui/material';

import Header from '@/components/04_Widgets/Navigation/Menus/mainHeader';

const MaintenancePage = () => {
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
        <img src={TechWorks} style={{ maxWidth: '500px' }} />
        <Typography sx={{ fontSize: '26px', fontWeight: 500 }}>
          Ведутся технические работы
        </Typography>
        <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#868686' }}>
          В течении некоторого времени сервис будет недоступен
        </Typography>
      </Box>
    </Container>
  );
};

export default MaintenancePage;
