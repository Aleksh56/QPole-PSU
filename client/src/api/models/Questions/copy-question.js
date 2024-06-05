import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const copyQuestionFx = createEffect(async ({ id, q_id }) => {
  const newQue = await handleRequest(
    'put',
    `${ENDPOINTS.QUESTIONS.BASE_URL}/?request_type=copy_question&poll_id=${id}&poll_question_id=${q_id}`,
  );
  return newQue.data;
});
