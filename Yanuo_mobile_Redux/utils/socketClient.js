import {io} from 'socket.io-client';
import {REACT_APP_API_URL} from '../constants';

let socket;
export const getSocket = (profileId) =>
{
    // console.log('socccccK', profileId);
    if (!socket)
    {
        socket = io(REACT_APP_API_URL);
        // socket.emit("new-user-add", profileId);
    }

    return socket;
}