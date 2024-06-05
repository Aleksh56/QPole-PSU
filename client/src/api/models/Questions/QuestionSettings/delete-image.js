import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const deleteImageFx = async ({ id, q_id }) => {
  return handleRequest(
    'put',
    `${ENDPOINTS.QUESTIONS.BASE_URL}/?poll_id=${id}&poll_question_id=${q_id}&request_type=delete_image`,
    {
      image: null,
    },
  );
};
