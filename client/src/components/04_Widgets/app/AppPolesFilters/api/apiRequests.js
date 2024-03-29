import { handleRequest } from '@/api/api';

export const filterPollsRequest = async (field, value, setter) => {
  return handleRequest('get', `/api/my_poll/?${field}=${value}`).then((res) => setter(res.data));
};
