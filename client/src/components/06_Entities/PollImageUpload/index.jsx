import React, { useEffect, useState } from 'react';
import { InvisibleInput, StyledImageButton } from './styled';
import { Box, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

const BASE_IMAGE_URL = 'http://89.111.155.6';

const PollImageUpload = ({ image = '', onFileSelect, handleDelete }) => {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (image) {
      setPreview(`${BASE_IMAGE_URL}${image}`);
    }
  }, [image]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileClear = () => {
    handleDelete();
    setPreview('');
    if (onFileClear) {
      onFileClear();
    }
  };

  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
    >
      {preview ? (
        <>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          <IconButton onClick={handleFileClear} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <StyledImageButton sx={{ width: '100%' }} component="label">
          <PhotoCamera />
          Выбор изображения
          <InvisibleInput accept="image/*" type="file" hidden onChange={handleFileChange} />
        </StyledImageButton>
      )}
    </Box>
  );
};

export default PollImageUpload;
