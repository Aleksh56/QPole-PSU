import { Box, Typography } from '@mui/material';

import {
  DescriptionTagsWrapper,
  DescriptionWrapper,
  HeaderWrapper,
  ImageWrapper,
  StyledDescText,
  StyledImage,
  StyledTitle,
} from './styled';

import config from '@/config';

const ConductionHeader = ({ data }) => {
  console.log(data);
  return (
    <HeaderWrapper>
      <ImageWrapper>
        <StyledImage src={config.serverUrl.main + data.image} />
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
