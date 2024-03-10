import PollListCard from '@/shared/PollListCard';
import React from 'react';
import { Grid } from '@mui/material';
import { PollListGridContainer } from './styled';
import useAuth from '@/hooks/useAuth';

const PollListOutput = ({ polls = [] }) => {
  const { isAuthenticated } = useAuth();

  return (
    <PollListGridContainer>
      {polls.map((item) => (
        <Grid item xs={12} sm={6}>
          <PollListCard item={item} isAuthenticated={isAuthenticated} />
        </Grid>
      ))}
    </PollListGridContainer>
  );
};

export default PollListOutput;
