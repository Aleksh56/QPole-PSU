import styled from '@emotion/styled';
import { Box } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const QueSettingsWrapper = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  columnGap: 0,
  rowGap: Rem(15),
  alignItems: 'center',
}));
