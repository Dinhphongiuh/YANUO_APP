import client from "./client";
const API = client;

// 
export const sendSigupMailOTP = (data) => API.post('otp/', data);
export const verifyOTPCode = (data) => API.post('/otp/verifyOTP/', data);