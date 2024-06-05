import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const changeRoleFx = createEffect(async ({ userId, role }) => {
  const data = await handleRequest(
    'put',
    `${ENDPOINTS.ADMIN.USER_SETTINGS}/?request_type=change_role&user_id=${userId}`,
    { role_name: role },
  );
  return data;
});
