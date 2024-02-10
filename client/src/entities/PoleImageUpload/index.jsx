import React from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { InvisibleInput, StyledImageButton } from './styled';

const PoleImageUpload = () => {
  return (
    <StyledImageButton component="label" fullWidth>
      <PhotoCamera />
      Выбор изображения
      <InvisibleInput accept="image/*" type="file" hidden />
    </StyledImageButton>
  );
};

export default PoleImageUpload;
