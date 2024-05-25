const userSockets = {};

module.exports = {
    userSockets,
    addUserSocket: (userId, socketId) => {
        userSockets[userId] = socketId;
    },
    removeUserSocket: (userId) => {
        delete userSockets[userId];
    },
    getUserSocket: (userId) => {
        return userSockets[userId];
    }
};

/*
index
const socketManager = require('./app/socketManager');

const userSockets = {};
const {
    Server
} = require('socket.io');
const io = new Server(server);
io.sockets.on('connection', (socket) => {
    // console.log('lodđ: ', socket.id)
    // Khi người dùng đăng nhập, lưu trữ socketId của họ
    socket.on('userLogin', (userId) => {
        // userSockets[userId] = socket.id;    
        socketManager.addUserSocket(userId, socket.id);
        console.log(userId)  
    });
    socket.on('disconnect', () => {
        console.log('dis: ', socket.id)
        socketManager.removeUserSocket(socket.id);
    });
});
*/