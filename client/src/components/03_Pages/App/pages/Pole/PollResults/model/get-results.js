import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const getPollResultsFx = createEffect(async ({ id }) => {
  const data = await handleRequest('get', `/api/my_poll_question/?poll_id=${id}`);
  return data.data;
});
