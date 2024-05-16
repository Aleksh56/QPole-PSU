import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';

export const changeRoleFx = createEffect(async ({ userId }) => {
  const data = await handleRequest(
    'put',
    `admin_api/users/?request_type=change_role&user_id=${userId}`,
  );
  return data;
});
