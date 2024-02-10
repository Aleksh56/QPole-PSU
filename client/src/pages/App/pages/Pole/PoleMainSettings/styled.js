import styled from '@emotion/styled';
import { Box, FormControlLabel } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const MainSettingsContentWrapper = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  maxWidth: Rem(1200),
  margin: `${Rem(24)} auto`,
  columnGap: Rem(30),
}));

export const PoleInfoContainer = styled(Box)(() => ({
  width: '65%',
  backgroundColor: '#fff',
  padding: Rem(40),
  boxShadow: '0 2px 4px rgba(0,0,0,.05), 0 8px 20px rgba(0,0,0,.1)',
  borderRadius: Rem(5),
}));

export const PoleInfoSwitchContainer = styled(Box)(() => ({
  display: 'grid',
  rowGap: '5px',
}));

export const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  maxWidth: 'max-content',
  '& .MuiTypography-root': {
    fontSize: '14px',
    color: '#909090',
  },
}));
