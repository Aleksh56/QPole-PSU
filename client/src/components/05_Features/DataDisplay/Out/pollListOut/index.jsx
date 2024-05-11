import { Grid } from '@mui/material';
import { v4 } from 'uuid';

import { PollListGridContainer } from './styled';

import { regOnPollFx } from '@/api/common-requests/poll-register';
import AppPoleCard from '@/components/04_Widgets/Data/Cards/appPoleCard';
import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';

const PollListOut = ({ polls = [] }) => {
  const handleRegistration = async (poll_id) => {
    await regOnPollFx({ poll_id });
  };

  return (
    <PollListGridContainer>
      {polls.map((item) => (
        <Grid key={v4()} item xs={12} sm={6} sx={{ maxHeight: '280px' }}>
          <AppPoleCard
            pollData={item}
            cardButton={
              item.has_user_participated_in ? (
                !item.opened_for_voting ? (
                  <PrimaryButton
                    caption="Зарегистрироваться"
                    handleClick={() => handleRegistration(item.poll_id)}
                    style={{ border: '1px solid orange', color: 'orange' }}
                  />
                ) : (
                  <PrimaryButton caption="Пройден" disabled={true} />
                )
              ) : (
                <PrimaryButton caption="Пройти" to={`/conduct-poll/${item.poll_id}`} />
              )
            }
          />
        </Grid>
      ))}
    </PollListGridContainer>
  );
};

export default PollListOut;
