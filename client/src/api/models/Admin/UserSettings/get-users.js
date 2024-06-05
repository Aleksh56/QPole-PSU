import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const getAllUsersFx = createEffect(async () => {
  const data = await handleRequest('get', `${ENDPOINTS.ADMIN.USER_SETTINGS}/`);
  return data;
});
