import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const publishPollFx = createEffect(async ({ id }) => {
  const data = await handleRequest(
    'put',
    `${ENDPOINTS.POLL.BASE_URL}/?poll_id=${id}&request_type=deploy_to_production`,
  );
  return data.data;
});
