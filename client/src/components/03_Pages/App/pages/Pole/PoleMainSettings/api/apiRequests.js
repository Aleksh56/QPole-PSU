import { handleRequest } from '@/api/api';
import axios from 'axios';

const timeouts = {};

export const getInfoAboutPole = async (id) => {
  return handleRequest('get', `/api/my_poll/?poll_id=${id}`);
};

export const changePoleData = async (field, value, id) => {
  if (timeouts[field]) {
    clearTimeout(timeouts[field]);
  }

  if (field === 'image') {
    axios.patch(
      `http://89.111.155.6/api/my_poll/?poll_id=${id}`,
      { [field]: value },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
          'content-type': 'multipart/form-data',
        },
      }
    );
  }

  timeouts[field] = setTimeout(() => {
    handleRequest('patch', `/api/my_poll/`, { poll_id: id, [field]: value });
    delete timeouts[field];
  }, 1500);
};
