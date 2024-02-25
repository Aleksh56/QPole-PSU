import { handleRequest } from '@/api/api';

export const patchPollSettings = async (id, field, value) => {
  console.log(field);
  return handleRequest('patch', `/api/my_poll/`, {
    poll_id: id,
    [field]: value,
  }).then((res) => console.log(res));
};
