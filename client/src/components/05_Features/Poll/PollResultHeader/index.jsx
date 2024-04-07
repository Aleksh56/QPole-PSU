import React from 'react';
import { Typography, Box } from '@mui/material';
import {
  DescriptionTagsWrapper,
  DescriptionWrapper,
  GraphWrapper,
  HeaderWrapper,
  StyledDescText,
  StyledTitle,
} from './styled';
import CustomGauge from '@/components/07_Shared/DataDisplay/Charts/gauge';

const PollResultHeader = () => {
  return (
    <HeaderWrapper>
      <GraphWrapper>
        <CustomGauge value={53} />
      </GraphWrapper>
      <DescriptionWrapper>
        <DescriptionTagsWrapper>
          <Typography sx={{ fontSize: '12px', color: '#aaa' }}>1</Typography>
          <Box>
            <Typography sx={{ fontSize: '12px' }}>21.12.24 17:00 – 22.12.25 12:00</Typography>
          </Box>
        </DescriptionTagsWrapper>
        <StyledTitle>1</StyledTitle>
        <StyledDescText>1</StyledDescText>
      </DescriptionWrapper>
    </HeaderWrapper>
  );
};

export default PollResultHeader;
