import { handleRequest } from '@/api/api';

const timeouts = {};

export const getInfoAboutPole = async (id) => {
  return handleRequest('get', `/api/my_poll/?poll_id=${id}`);
};

export const changePoleData = async (field, value, id) => {
  if (timeouts[field]) {
    clearTimeout(timeouts[field]);
  }

  timeouts[field] = setTimeout(() => {
    handleRequest('patch', `/api/my_poll/`, { poll_id: id, [field]: value });
    delete timeouts[field];
  }, 1500);
};
