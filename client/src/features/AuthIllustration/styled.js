import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const IllustrationGridWrapper = styled(Grid)(() => ({
  // ToDo - rewrite flex -> grid
  display: 'flex',
  flexDirection: 'column',
  padding: Rem(60),
  backgroundColor: designTokens.colors.primaryBlue,
  flexBasis: '70%',
  maxWidth: '70%',
  '& a': {
    fontSize: Rem(36),
    color: '#000',
  },
  '& img': {
    maxWidth: '50%',
    height: '100%',
    alignSelf: 'center',
  },
}));
