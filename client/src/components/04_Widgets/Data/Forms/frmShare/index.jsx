import React, { useState } from 'react';
import { DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ShareDialog, ShareDialogTitle, StyledCheckIcon } from './styled';
import FrmShareMain from '@/components/05_Features/frmShareMain';
import FrmShareQR from '@/components/05_Features/frmShareQR';

const FrmShare = ({ open, setOpen }) => {
  const [activeView, setActiveView] = useState('main');

  const handleSwitchView = (view) => setActiveView(view);

  return (
    <ShareDialog
      open={open}
      onClose={() => {
        setOpen(false);
        setActiveView('main');
      }}
    >
      <ShareDialogTitle>
        <StyledCheckIcon color="success" />
        Опрос успешно опубликован
        <CloseIcon
          onClick={() => {
            setOpen(false);
            setActiveView('main');
          }}
          sx={{ marginLeft: 'auto', cursor: 'pointer' }}
        />
      </ShareDialogTitle>
      <DialogContent sx={{ p: '0' }}>
        {activeView === 'main' && <FrmShareMain setView={handleSwitchView} />}
        {activeView === 'qr' && <FrmShareQR setView={handleSwitchView} />}
        {/* {activeView === 'email' && <FrmShareEmail setView={handleSwitchView}/>} */}
      </DialogContent>
    </ShareDialog>
  );
};

export default FrmShare;
