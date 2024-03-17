import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const toggleMultipleFx = createEffect(async ({ id, q_id, value }) => {
  await handleRequest('patch', `/api/my_poll_question/`, {
    poll_id: id,
    poll_question_id: q_id,
    has_multiple_choices: value,
  });
});
