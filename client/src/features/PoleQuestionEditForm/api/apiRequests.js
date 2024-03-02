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

export const changeOptionRequest = async (id, q_id, opt_id, fieldName, value) => {
  return handleRequest('patch', `/api/my_poll_question_option/`, {
    poll_id: id,
    poll_question_id: q_id,
    question_option_id: opt_id,
    [fieldName]: value,
  });
};

export const deleteOptionRequest = async (id, q_id, opt_id) => {
  return handleRequest(
    'delete',
    `/api/my_poll_question_option/?poll_id=${id}&poll_question_id=${q_id}&question_option_id=${opt_id}`
  );
};

export const changeOptionOrderRequest = async (id, q_id, opt_data) => {
  return handleRequest('put', `/api/my_poll_question_option/`, {
    poll_id: id,
    poll_question_id: q_id,
    options_data: opt_data,
    request_type: 'change_order',
  });
};
