import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';

export const banUserFx = createEffect(async (user_id) => {
  const data = await handleRequest('patch', `/admin_api/users/?user_id=${user_id}`, {
    is_banned: 1,
  });
  return data.data;
});
