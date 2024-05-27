import axiosClient from "./axiosClient";
import client from "./client";

const BASE_URL = '/friends';

const friendApi = {
    fetchFriends: params => {
        return axiosClient.get(BASE_URL, {params});
    },
}

export default friendApi;