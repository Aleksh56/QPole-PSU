import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const FrmShare = ({ open, setOpen }) => {
  const [surveyLink, setSurveyLink] = useState('https://example.com/survey');

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyLink);
    alert('Ссылка скопирована!');
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{ '& .MuiPaper-root': { borderRadius: '24px' } }}
    >
      <DialogTitle sx={{ bgcolor: '#e6f6e0', display: 'flex', alignItems: 'center' }}>
        <CheckCircleIcon
          color="success"
          sx={{ width: '1.5em', height: '1.5em', marginRight: '15px', color: 'rgb(107, 193, 74)' }}
        />
        Опрос успешно опубликован
        <IconButton onClick={() => setOpen(false)} sx={{ marginLeft: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '0' }}>
        <Box sx={{ padding: '16px 24px 24px' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', color: '#313442' }}
          >
            Прямая ссылка на ваш опрос
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px', color: '#7d8696' }}
          >
            Скопируйте и отправьте своим респондентам ссылку
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={surveyLink}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleCopy}>
                    <ContentCopyIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Button sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContentCopyIcon />
              <Box>
                <Typography variant="body1">QR-код</Typography>
                <Typography variant="caption">Скачайте рисунок с QR-кодом вашего опроса</Typography>
              </Box>
            </Box>
            <ArrowForwardIosIcon />
          </Button>
          <Button sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ContentCopyIcon />
              <Box>
                <Typography variant="body1">Email приглашения</Typography>
                <Typography variant="caption">Пригласите участников опроса</Typography>
              </Box>
            </Box>
            <ArrowForwardIosIcon />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FrmShare;
