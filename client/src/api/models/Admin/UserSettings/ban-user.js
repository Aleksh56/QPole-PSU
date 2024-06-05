import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const banUserFx = createEffect(async ({ id, status }) => {
  const data = await handleRequest('patch', `${ENDPOINTS.ADMIN.USER_SETTINGS}/?user_id=${id}`, {
    is_banned: status,
  });
  return data.data;
});
