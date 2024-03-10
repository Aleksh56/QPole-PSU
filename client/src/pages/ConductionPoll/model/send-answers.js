import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const sendAnswersRequest = createEffect(async (data) => {
  await handleRequest('post', `/api/poll_voting/`, data);
});
