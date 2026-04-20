import axios from 'axios';

const BASE = 'http://localhost:5005';

export const getStore = async (token: string) => {
  const res = await axios.get(`${BASE}/store`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.store;
};

export const putStore = async (token: string, store: object) => {
  await axios.put(`${BASE}/store`, { store }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};