import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';

export const startConductionFx = createEffect(async ({ id }) => {
  const response = await handleRequest('post', `/api/poll_voting_started/?poll_id=${id}`);
  return response.data;
});
