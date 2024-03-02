import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { designTokens } from '@/constants/designTokens';
import { Rem } from '@/utils/convertToRem';
import { Link } from 'react-router-dom';

export const StyledAppContentWrapper = styled(Box)(() => ({
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: `${Rem(100)} 0`,
  width: '100%',
}));

export const ContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  rowGap: '20px',
  width: '100%',
});

export const PollsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
});

export const StyledArchiveLink = styled(Link)({
  alignSelf: 'end',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  columnGap: '10px',
  color: designTokens.colors.primaryBlue,
});
