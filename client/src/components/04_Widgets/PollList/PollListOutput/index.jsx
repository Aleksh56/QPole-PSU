import React from 'react';
import { Grid } from '@mui/material';
import { PollListGridContainer } from './styled';
import useAuth from '@/hooks/useAuth';
import AppPoleCard from '@/components/07_Shared/DataDisplay/Cards/appPoleCard';
import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';

const PollListOutput = ({ polls = [] }) => {
  const { isAuthenticated } = useAuth();

  return (
    <PollListGridContainer>
      {polls.map((item) => (
        <Grid item xs={12} sm={6} sx={{ maxHeight: '280px' }}>
          <AppPoleCard
            pollData={item}
            cardButton={<PrimaryButton caption="Пройти" to={`/conduct-poll/${item.poll_id}`} />}
          />
        </Grid>
      ))}
    </PollListGridContainer>
  );
};

export default PollListOutput;
