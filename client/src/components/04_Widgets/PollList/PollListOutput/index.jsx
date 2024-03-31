import React from 'react';
import { Grid } from '@mui/material';
import { PollListGridContainer } from './styled';
import useAuth from '@/hooks/useAuth';
import AppPoleCard from '@/components/07_Shared/AppPoleCard';

const PollListOutput = ({ polls = [] }) => {
  const { isAuthenticated } = useAuth();

  return (
    <PollListGridContainer>
      {polls.map((item) => (
        <Grid item xs={12} sm={6}>
          <AppPoleCard pollData={item} />
        </Grid>
      ))}
    </PollListGridContainer>
  );
};

export default PollListOutput;
