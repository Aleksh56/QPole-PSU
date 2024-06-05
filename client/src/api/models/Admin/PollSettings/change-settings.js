import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const changeSettingsFx = createEffect(async ({ link, value }) => {
  const data = await handleRequest('patch', `${ENDPOINTS.ADMIN.POLL_SETTINGS}/?poll_id=1`, {
    [link]: value,
  });
  return data.data;
});
