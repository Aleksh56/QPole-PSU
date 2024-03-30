import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  DescriptionTagsWrapper,
  DescriptionWrapper,
  HeaderWrapper,
  ImageWrapper,
  StyledDescText,
  StyledImage,
  StyledTitle,
} from './styled';

const ConductionHeader = ({ data }) => {
  const BASE_URL = `http://188.225.45.226`;
  return (
    <HeaderWrapper>
      <ImageWrapper>
        <StyledImage src={BASE_URL + data.image} />
      </ImageWrapper>
      <DescriptionWrapper>
        <DescriptionTagsWrapper>
          <Typography sx={{ fontSize: '12px', color: '#aaa' }}>{data.poll_type?.name}</Typography>
          <Box>
            <Typography sx={{ fontSize: '12px' }}>21.12.24 17:00 – 22.12.25 12:00</Typography>
          </Box>
        </DescriptionTagsWrapper>
        <StyledTitle>{data.name ?? ''}</StyledTitle>
        <StyledDescText>{data.description}</StyledDescText>
      </DescriptionWrapper>
    </HeaderWrapper>
  );
};

export default ConductionHeader;
