import { handleRequest } from '@/api/api';

export const getAllPoles = async () => {
  return handleRequest('get', '/api/my_poll/');
};
