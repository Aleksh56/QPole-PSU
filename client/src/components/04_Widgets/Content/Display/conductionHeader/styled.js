import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

import { Rem } from '@/utils/convertToRem';

export const HeaderWrapper = styled(Box)(() => ({
  width: '100%',
  border: `${Rem(1)} solid #D7D7D7`,
  padding: Rem(20),
  borderRadius: Rem(16),
  backgroundColor: '#fff',
  display: 'grid',
  gridTemplateColumns: '0.8fr 1fr',
  columnGap: Rem(20),
}));

export const ImageWrapper = styled(Box)(() => ({
  width: '100%',
  border: `${Rem(1)} solid #D7D7D7`,
  borderRadius: Rem(16),
  height: Rem(200),
  overflow: 'hidden',
}));

export const StyledImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  objectFit: 'cover',
}));

export const DescriptionWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
}));

export const DescriptionTagsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

export const StyledTitle = styled(Typography)(() => ({
  fontSize: Rem(16),
  fontWeight: 600,
  padding: `${Rem(10)} 0`,
  borderBottom: `${Rem(1)} solid #000`,
  width: '100%',
}));

export const StyledDescText = styled(Typography)(() => ({
  width: '100%',
  marginTop: Rem(10),
  fontSize: Rem(14),
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
}));
