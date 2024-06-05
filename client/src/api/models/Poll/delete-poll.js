import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const deletePollFx = createEffect(async (poll_id) => {
  await handleRequest('delete', `${ENDPOINTS.POLL.BASE_URL}/?poll_id=${poll_id}`);
});
