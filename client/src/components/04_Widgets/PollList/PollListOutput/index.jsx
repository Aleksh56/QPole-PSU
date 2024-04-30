import AppPoleCard from '@/components/04_Widgets/Data/Cards/appPoleCard';
import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';
import useAuth from '@/hooks/useAuth';
import { Grid } from '@mui/material';
import React from 'react';
import { v4 } from 'uuid';
import { PollListGridContainer } from './styled';

const PollListOutput = ({ polls = [] }) => {
  const { isAuthenticated } = useAuth();

  return (
    <PollListGridContainer>
      {polls.map((item) => (
        <Grid key={v4()} item xs={12} sm={6} sx={{ maxHeight: '280px' }}>
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
