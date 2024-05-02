import { Grid } from '@mui/material';
import { v4 } from 'uuid';

import { PollListGridContainer } from './styled';

import AppPoleCard from '@/components/04_Widgets/Data/Cards/appPoleCard';
import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';

const PollListOut = ({ polls = [] }) => {
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

export default PollListOut;
