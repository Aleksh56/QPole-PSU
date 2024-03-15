import styled from '@emotion/styled';
import { Box, Tabs } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const TabsButtonsContainer = styled(Box)(() => ({
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,.05), 0 8px 20px rgba(0,0,0,.1)',
  borderRadius: '5px',
}));

export const StyledTabs = styled(Tabs)(() => ({
  '& .MuiTabs-flexContainer': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
  },
}));
