import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const getTicketsFx = createEffect(async () => {
  const data = await handleRequest('get', `/admin_api/support_request/`);
  return data.data;
});
