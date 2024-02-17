import { handleRequest } from '@/api/api';

export const getAllPoles = async () => {
  return handleRequest('get', '/api/my_poll/');
};

export const getProfileData = async () => {
  return handleRequest('get', '/api/get_my_profile/');
};
