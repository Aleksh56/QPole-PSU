import { handleRequest } from '@/api/api';

export const deletePollRequest = async (id) => {
  return handleRequest('delete', `/api/my_poll/?poll_id=${id}`);
};
