import { handleRequest } from '@/api/api';

export const createPole = async (poleType) => {
  return handleRequest('post', '/pole/createPole/', poleType, 'Create_pole');
};
