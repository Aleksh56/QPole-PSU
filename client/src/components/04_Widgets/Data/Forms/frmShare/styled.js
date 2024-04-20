import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { Dialog, DialogTitle } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
