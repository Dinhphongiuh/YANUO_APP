import axiosClient from "./axiosClient";

const BASE_URL = '/me';

const meApi = {
    fetchProfile: () => {
        return axiosClient.get(`${BASE_URL}/profile`);
    }
}

export default meApi;