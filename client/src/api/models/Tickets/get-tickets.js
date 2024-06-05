import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const getTicketsFx = createEffect(async () => {
  const data = await handleRequest('get', `${ENDPOINTS.ADMIN.GET_TICKETS}/`);
  return data.data;
});
