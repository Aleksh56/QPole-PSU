import styled from '@emotion/styled';
import { Box, Tabs } from '@mui/material';
import { Rem } from '@/utils/convertToRem';

export const TabPanelWrapper = styled(Box)(() => ({
  backgroundColor: '#fff',
  marginTop: '10px',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0,0,0,.05), 0 8px 20px rgba(0,0,0,.1)',
}));
