import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const changeUserDataFx = createEffect(async ({ user_id, field, value }) => {
  await handleRequest('patch', `${ENDPOINTS.USER.CHANGE_SELF_DATA}/?user_id=${user_id}`, {
    [field]: value,
  });
});
