import Axios from "axios";
import client from "./client";

// const API = Axios.create({baseURL: 'http://192.168.1.192:3000'});
const API = client;


export const createChat = (data) => API.post('/chat', data);

export const userChats = (id) => API.get(`/chat/${id}`);
export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);
export const createGroupChat = (data) => API.post('/chat/group', data);