import React from 'react';
import { CardMedia, CardContent, CardActions } from '@mui/material';
import { CardButton, CardContentWrapper, CardDescription, CardTitle, CardWrapper } from './styled';
import { useNavigate } from 'react-router-dom';

const PollListCard = ({ item, isAuthenticated }) => {
  const navigate = useNavigate();

  const handleConductPoll = () => {
    navigate(`/conduct-poll/${item.poll_id}`);
  };

  console.log(item);

  return (
    <CardWrapper>
      <CardMedia component="img" sx={{ width: '50%' }} image="/path/to/your/image.jpg" />
      <CardContentWrapper>
        <CardContent sx={{ flexGrow: 1 }}>
          <CardTitle gutterBottom noWrap>
            {item.name ?? '[Название опроса]'}
            {item.poll_type.name ?? '[Название опроса]'}
          </CardTitle>
          <CardDescription>{item.description ?? '[Описание опроса]'}</CardDescription>
        </CardContent>
        <CardActions>
          <CardButton
            disabled={!isAuthenticated || item.has_user_participated_in}
            isAuthenticated={isAuthenticated}
            onClick={() => handleConductPoll()}
          >
            Пройти опрос
          </CardButton>
        </CardActions>
      </CardContentWrapper>
    </CardWrapper>
  );
};

export default PollListCard;
