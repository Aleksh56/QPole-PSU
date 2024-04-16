import React from 'react';
import { Typography, Box, styled } from '@mui/material';
import {
  DescriptionTagsWrapper,
  DescriptionWrapper,
  GraphWrapper,
  HeaderWrapper,
  StyledDescText,
  StyledTitle,
} from './styled';
import CustomGauge from '@/components/07_Shared/DataDisplay/Charts/gauge';

// const TwoColumnWrapper = styled.div`
//   display: 'flex';
//   justify-content: 'space-between';
//   align-items: 'center';
//   padding: '16px';
// `;

// const Column = styled.div`
//   flex: 1;
//   padding: '0 12px';
// `;

const PollResultHeader = ({ data }) => {
  const { results } = data;

  return (
    <HeaderWrapper>
      <GraphWrapper>
        <CustomGauge value={results.percentage} />
      </GraphWrapper>
      <DescriptionWrapper>
        <DescriptionTagsWrapper>
          <Typography sx={{ fontSize: '12px', color: '#aaa' }}>1</Typography>
          <Box>
            <Typography sx={{ fontSize: '12px' }}>21.12.24 17:00 – 22.12.25 12:00</Typography>
          </Box>
        </DescriptionTagsWrapper>
        {/* <TwoColumnWrapper>
          <Column>
            <StyledTitle>Results Overview</StyledTitle>
          </Column>
          <Column>
            <StyledDescText>
              {correctAnswers} out of {totalQuestions} correct ({percentage}%)
            </StyledDescText>
          </Column>
        </TwoColumnWrapper> */}
      </DescriptionWrapper>
    </HeaderWrapper>
  );
};

export default PollResultHeader;
