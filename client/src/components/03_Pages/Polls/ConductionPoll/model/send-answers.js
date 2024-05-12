import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';

export const sendAnswersRequestFx = createEffect(async ({ answers, id, isTimeEnd }) => {
  const response = await handleRequest(
    'post',
    `/api/poll_voting${isTimeEnd ? '_ended' : ''}/?poll_id=${id}`,
    {
      answers: answers,
    },
  );
  return response.data;
});
