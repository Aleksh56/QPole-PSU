import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Box, Button, Dialog, DialogTitle, TextField, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colorConfig } from '@/app/template/config/color.config';

export const ShareDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': { borderRadius: '24px' },
}));

export const ShareDialogTitle = styled(DialogTitle)(() => ({
  backgroundColor: '#e6f6e0',
  display: 'flex',
  alignItems: 'center',
}));

export const StyledCheckIcon = styled(CheckCircleIcon)(() => ({
  width: '1.5em',
  height: '1.5em',
  marginRight: Rem(15),
  color: 'rgb(107, 193, 74)',
}));

export const LinkTitle = styled(Typography)(() => ({
  fontSize: Rem(14),
  fontWeight: 500,
  lineHeight: Rem(20),
  color: '#313442',
}));

export const LinkBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: Rem(10),
  columnGap: Rem(20),
}));

export const CopyButton = styled(Button)(({ propColor }) => ({
  backgroundColor: propColor,
  borderRadius: Rem(20),
  color: '#fff',
  textTransform: 'none',
  padding: `${Rem(5)} ${Rem(30)}`,
  height: Rem(40),
  fontSize: Rem(14),
  transition: 'all .3s ease',
  '&:hover': {
    backgroundColor: propColor,
  },
}));

export const LinkField = styled(TextField)(({ propColor, textColor }) => ({
  height: Rem(40),
  transition: 'all .3s ease',
  '& .MuiInputBase-root': {
    height: Rem(40),
    borderRadius: Rem(68),
    border: 'rgba(39, 116, 248, .51)',
    backgroundColor: propColor,
    color: textColor,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'rgba(39, 116, 248, .51)',
    },
    '& .MuiInputBase-input': {
      padding: '10px 14px',
    },
  },
}));

export const LinkDesc = styled(Typography)(() => ({
  fontSize: Rem(14),
  fontWeight: 400,
  lineHeight: Rem(20),
  color: '#7d8696',
}));

export const LinkContent = styled(Box)(() => ({
  padding: '16px 24px 16px',
}));

export const BtnsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
}));

export const ShareBtn = styled(Button)(() => ({
  width: '100%',
  padding: `${Rem(16)} ${Rem(24)}`,
  justifyContent: 'space-between',
  borderBottom: '1px solid #e9ebef',
}));

export const ShareBtnContent = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: Rem(15),
  alignItems: 'center',
}));

export const ShareTextWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  textTransform: 'none',
}));

export const ShareTitle = styled(Typography)(() => ({
  fontSize: Rem(14),
  fontWeight: 600,
  lineHeight: Rem(20),
  color: '#313442',
}));

export const ShareDescription = styled(Typography)(() => ({
  fontSize: Rem(14),
  fontWeight: 500,
  lineHeight: Rem(20),
  color: 'rgb(105, 112, 116)',
}));

export const StyledArrowForwardIosIcon = styled(ArrowForwardIosIcon)(() => ({
  color: 'rgb(125, 134, 150)',
  fontSize: Rem(16),
  marginLeft: Rem(20),
}));
