import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';
import { v4 } from 'uuid';

export const duplicatePollFx = createEffect(async (poll_id) => {
  await handleRequest('put', '/api/my_poll/', {
    poll_id,
    new_poll_id: v4(),
    request_type: 'clone_poll',
  });
});
