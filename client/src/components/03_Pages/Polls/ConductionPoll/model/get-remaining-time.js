import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';

export const getRemainingTimeFx = createEffect(async ({ id }) => {
  const response = await handleRequest('get', `/api/poll_voting_started/?poll_id=${id}`);
  return response.data;
});
