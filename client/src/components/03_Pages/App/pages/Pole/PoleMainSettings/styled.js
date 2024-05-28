import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const SettingsWrapper = styled(Box)(() => ({
  display: 'flex',
  backgroundColor: '#f9fafb',
  padding: '15px',
}));

export const MainSettingsContentWrapper = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  maxWidth: Rem(1200),
  margin: `${Rem(24)} auto`,
  columnGap: Rem(30),
  '@media (max-width: 999px)': {
    display: 'none',
  },
}));

export const MobileSettingsContentWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'grid',
  backgroundColor: '#fff',
  gridTemplateColumns: '1fr',
  rowGap: '15px',
  padding: '25px',
  borderRadius: '15px',
  '@media (min-width: 1000px)': {
    display: 'none',
  },
}));

export const PoleInfoContainer = styled(Box)(() => ({
  width: '65%',
  backgroundColor: '#fff',
  padding: Rem(40),
  boxShadow: '0 2px 4px rgba(0,0,0,.05), 0 8px 20px rgba(0,0,0,.1)',
  borderRadius: Rem(5),
}));

export const TimeSettingsWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '20px',
}));

export const MobTimeSettingsWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '20px',
  '@media (max-width: 550px)': {
    gridTemplateColumns: '1fr',
  },
}));

export const PoleInfoSwitchContainer = styled(Box)(() => ({
  display: 'grid',
  rowGap: '5px',
}));
