import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const pathcPollSettingsFx = createEffect(async ({ id, value, field }) => {
  await handleRequest('patch', `/api/my_poll/`, {
    poll_id: id,
    [field]: value,
  });
});
