import axios from "axios";
import client from "./client";

// const API = axios.create({baseURL: 'http://192.168.1.131:3000'});
const API = client;

export const getUser = (userId) => API.get(`/user/${userId}`);