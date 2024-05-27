import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { REACT_APP_API_URL } from '../../constants';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const profile = useSelector(state => state.meSlice.userProfile);
    const socket = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (profile && profile._id) {
            socket.current = io(REACT_APP_API_URL);
            socket.current.emit("new-user-add", profile._id);
            socket.current.on('get-users', (users) => {
                setOnlineUsers(users);
                console.log('online: ', users);
            });
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [profile]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
