import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const changeQuestionTypeFx = async (id, q_id, type) => {
  return handleRequest(
    'patch',
    `${ENDPOINTS.QUESTIONS.BASE_URL}/?poll_id=${id}&poll_question_id=${q_id}`,
    type,
  );
};
