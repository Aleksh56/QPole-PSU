import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const closePollFx = createEffect(async (poll_id) => {
  await handleRequest('patch', `${ENDPOINTS.POLL.BASE_URL}/?poll_id=${poll_id}`, {
    is_closed: true,
  });
});
