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
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            columnGap: '20px',
          }}
        >
          {buttons.map((button, index) => (
            <div
              key={index}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '20px 10px',
                borderRadius: '7px',
                boxShadow:
                  '0px 8px 20px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <img src={button.image} alt={button.title} />
              <p
                style={{
                  marginTop: '20px',
                  fontSize: '14px',
                  color: '#515151',
                  lineHeight: '18px',
                  fontWeight: 600,
                }}
              >
                {button.title}
              </p>
              <p
                style={{
                  marginTop: '5px',
                  fontSize: '12px',
                  lineHeight: '14px',
                }}
              >
                {button.caption}
              </p>
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
