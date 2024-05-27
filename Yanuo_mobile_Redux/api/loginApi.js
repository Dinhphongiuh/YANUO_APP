import axiosClient from "./axiosClient";

const BASE_URL = '/auth';

const loginApi = {
    login: account => {
        const url = `${BASE_URL}/login`
        return axiosClient.post(url, account);
    },
    refreshToken: refreshToken => {
        const url = `${BASE_URL}/refresh-token`;
        return axiosClient.post(url, {refreshToken});
    },
    register: userAccount => {
        const url = `${BASE_URL}/registry`;
        return axiosClient.post(url, {userAccount});
    }
}

export default loginApi;