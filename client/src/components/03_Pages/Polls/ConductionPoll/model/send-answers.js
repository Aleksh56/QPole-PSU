import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';

export const sendAnswersRequestFx = createEffect(async ({ answers, id }) => {
  const response = await handleRequest('post', `/api/poll_voting/?poll_id=${id}`, {
    answers: answers,
  });
  return response.data;
});
