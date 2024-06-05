import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const patchPollSettingsFx = createEffect(async ({ id, value, field }) => {
  await handleRequest('patch', `${ENDPOINTS.POLL.BASE_URL}/?poll_id=${id}`, {
    [field]: value,
  });
});
