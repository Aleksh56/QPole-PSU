import { createEffect } from 'effector';

import { handleRequest } from '@/api/api';
import { ENDPOINTS } from '@/api/api.constants';

export const filterPollsFx = createEffect(async ({ field, value, setPollData }) => {
  const queryString = value !== '' ? `?${field}=${value}` : '';
  const res = await handleRequest('get', `${ENDPOINTS.POLL.BASE_URL}/${queryString}`);
  setPollData(res.data.results);
});
