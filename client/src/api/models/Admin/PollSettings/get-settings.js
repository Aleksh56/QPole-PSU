import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const getSettingsFx = createEffect(async () => {
  const data = await handleRequest('get', `${ENDPOINTS.ADMIN.POLL_SETTINGS}/`);
  return data.data;
});
