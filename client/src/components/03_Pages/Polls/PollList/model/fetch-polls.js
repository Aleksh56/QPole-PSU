import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const fetchAllPolls = createEffect(async () => {
  const response = await handleRequest('get', '/api/poll/');
  return response.data;
});
