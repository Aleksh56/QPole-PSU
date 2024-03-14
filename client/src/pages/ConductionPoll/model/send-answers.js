import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const sendAnswersRequestFx = createEffect(async (data) => {
  const response = await handleRequest('post', `/api/poll_voting/`, data);
  return response.data;
});
