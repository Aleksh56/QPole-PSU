import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

const CreatePoleModal = ({ isOpen, onClose, title, content, buttons }) => {
  const classes = 1;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle className={classes.modalTitle}>{title}</DialogTitle>
      <DialogContent>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          {buttons.map((button, index) => (
            <div key={index}>
              <img src={button.image} alt={button.title} />
              <p>{button.title}</p>
              <p>{button.caption}</p>
            </div>
          ))}
        </Box>
      </DialogContent>
      {/* <DialogActions>
        {buttons.map((button, index) => (
          <Button key={index} onClick={button.onClick} color="primary">
            {button.label}
          </Button>
        ))}
      </DialogActions> */}
    </Dialog>
  );
};

export default CreatePoleModal;
