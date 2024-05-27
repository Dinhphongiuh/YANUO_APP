import axios from 'axios';
import client from './client';

// const API = axios.create({baseURL: 'http://192.168.1.176:3000'});
const API = client;

// export const getMessages = (id) => API.get(`/message/${id}`);
export const getMessages = (Chat_id, _id) => API.get(`/message/${Chat_id}/${_id}`);
export const addMessage = (data) => API.post(`/message/`, data);
export const getConversition = (currentId) => API.get(`/chat/genConversition/${currentId}`);

export const addMessageImage = (data) => API.post(`/message/sendImage/`, data);
export const recallMessage = (data) => API.post(`/message/recall`, data);
export const deleteOne = (data) => API.post('/message/deleteOne/', data);
export const pinMessage = (data) => API.post(`/message/pin-message`, data);
export const unPinMessage = (data) => API.post(`/message/unPin-message`, data);
export const getPinMessage = (chat_id) => API.post(`/message/${chat_id}/pinned-messages`);
// đọc tin nhắn
export const readMessage = (data) => API.post('/message/readMessage', data);