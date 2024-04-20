import React from 'react';
import { LoaderWrapper } from './styled';
import { CircularProgress } from '@mui/material';

const CLoader = () => {
  return (
    <LoaderWrapper>
      <CircularProgress color="secondary" />
    </LoaderWrapper>
  );
};

export default CLoader;
