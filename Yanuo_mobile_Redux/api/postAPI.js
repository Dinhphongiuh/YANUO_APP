import client from './client';

const API = client;

export const createPost = (data) => API.post('/post/', data);
export const getListPost = (userId) => API.get(`/post/getListPost/${userId}`);