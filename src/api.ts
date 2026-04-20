import axios from 'axios';

const BASE = 'https://z5488515-presto-be.vercel.app';

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