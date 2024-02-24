import { handleRequest } from '@/api/api';

export const handleChangeQuestionInfoRequest = async (fieldName, value, id, q_id) => {
  return handleRequest('patch', `/api/my_poll_question/`, {
    poll_id: id,
    poll_question_id: q_id,
    [fieldName]: value,
  });
};

export const getAllOptionsRequest = async (id, q_id) => {
  return handleRequest(
    'get',
    `/api/my_poll_question_option/?poll_id=${id}&poll_question_id=${q_id}`
  );
};

export const addOptionRequest = async (id, q_id) => {
  return handleRequest('post', `/api/my_poll_question_option/`, {
    poll_id: id,
    poll_question_id: q_id,
  });
};
