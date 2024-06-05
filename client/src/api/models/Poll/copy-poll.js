import { createEffect } from 'effector';
import { v4 } from 'uuid';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const copyPollFx = createEffect(async (poll_id) => {
  await handleRequest(
    'put',
    `${ENDPOINTS.POLL.BASE_URL}/?request_type=clone_poll&poll_id=${poll_id}`,
    {
      new_poll_id: v4(),
    },
  );
});
