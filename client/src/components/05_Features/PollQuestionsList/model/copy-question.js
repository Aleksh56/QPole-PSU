import { handleRequest } from '@/api/api';
import { createEffect } from 'effector';

export const copyQuestionFx = createEffect(async (data) => {
  const newQue = await handleRequest(
    'put',
    '/api/my_poll_question/?request_type=copy_question/',
    data
  );
  return newQue.data;
});
