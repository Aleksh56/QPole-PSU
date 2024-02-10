import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import {
  ButtonContainer,
  ButtonContainerDescription,
  ButtonContainerTitle,
  DialogContentWrapper,
  StyledDialogTitle,
} from './styled';
import { v4 } from 'uuid';
import { createPole } from './api/apiRequests';
import { useNavigate } from 'react-router-dom';

const CreatePoleModal = ({ isOpen, onClose, title, buttons }) => {
  const navigate = useNavigate();

  const handlePoleTypeSelect = async (poleType) => {
    const newPoleId = v4();
    // await createPole(poleType, newPoleId);
    navigate(`/app/tests/${newPoleId}/main`);
  };

  return (
    <Dialog open={isOpen} onClose={() => onClose(false)}>
      <StyledDialogTitle>{title}</StyledDialogTitle>
      <DialogContent>
        <DialogContentWrapper>
          {buttons.map((button) => (
            <ButtonContainer
              key={v4()}
              onClick={() => handlePoleTypeSelect(button.type)}
            >
              <button.image sx={{ width: '38px', height: '38px' }} />
              <ButtonContainerTitle>{button.title}</ButtonContainerTitle>
              <ButtonContainerDescription>
                {button.caption}
              </ButtonContainerDescription>
            </ButtonContainer>
          ))}
        </DialogContentWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoleModal;
