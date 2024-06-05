import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const createPollFx = createEffect(async ({ pollType, newID }) => {
  return handleRequest(
    'post',
    `${ENDPOINTS.POLL.BASE_URL}/`,
    { poll_type: pollType, poll_id: newID },
    'Create_pole',
  );
});
