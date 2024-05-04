import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: Rem(1200),
  margin: `${Rem(24)} auto`,
  columnGap: Rem(30),
  padding: '0 15px',
}));

export const SettingsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: Rem(15),
  width: '100%',
  marginBottom: Rem(20),
}));

export const ResultsGridWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: Rem(30),
  width: '100%',
}));
