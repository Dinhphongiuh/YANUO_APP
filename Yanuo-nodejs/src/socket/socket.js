const { log } = require('util');

const io = require('socket.io')(8800, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

let activeUsers = [];

io.on('connection', (socket) => {
    // console.log('có thiết bị đang kết nối id: ', socket.id);
    socket.on('new-user-add', (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId))
        {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log("Connected Users", activeUsers)
        io.emit('get-users', activeUsers)
    })

    // send message
    // socket.on("send-message", (data) => {
    //     const {receiverId} = data;
    //     const user = activeUsers.find((user) => user.userId === receiverId)
    //     console.log('sending from socket to: ', user);
    //     console.log("Data", data);
    //     if (user)   
    //     {
    //         io.to(user.socketId).emit("receive-message", data);
    //     }
    // })

    socket.on("send-message", (data) => {
        const { receiverId } = data;
        console.log('13', data);
        // Check if receiverId is an array (group chat) or single value (private chat)
        if (Array.isArray(receiverId)) {
            // It's a group chat, loop through all receiverIds
            receiverId.forEach(id => {
                const user = activeUsers.find((user) => user.userId === id);
                if (user) {
                    io.to(user.socketId).emit("receive-message", data);
                }
            });
        } else {
            // It's a private chat, send to the single receiverId
            const user = activeUsers.find((user) => user.userId === receiverId);
            if (user) {
                io.to(user.socketId).emit("receive-message", data);
                console.log(data);
            }
        }
    });
    

    // send image  - video..
    socket.on('send-media', (data) => {
        console.log(data);
        const { receiverId } = data;
    
        // Kiểm tra xem receiverId có phải là mảng hay không
        if (Array.isArray(receiverId)) {
            // Nếu là mảng, lặp qua và gửi media cho mỗi người dùng trong nhóm
            receiverId.forEach(id => {
                const user = activeUsers.find((user) => user.userId === id);
                console.log('us', user)
                if (user) {
                    io.to(user.socketId).emit('receive-media', data);
                }
            });
        } else {
            // Nếu không phải là mảng, gửi media cho người dùng đơn lẻ
            const user = activeUsers.find((user) => user.userId === receiverId);
            if (user) {
                io.to(user.socketId).emit('receive-media', data);
            }
        }
    });
    // thu hồi tin nhắn
    socket.on('recall-message', (data) => {
        const receiverId = data.receiverId;
        console.log('log Data', receiverId);
        if (Array.isArray(receiverId))
        {
            receiverId.forEach(id => {
                const user = activeUsers.find((user) => user.userId === id);
                console.log('us', user)
                if (user) {
                    io.to(user.socketId).emit('recall-message-receive', data);
                }
            });
        }
        else
        {
            const user = activeUsers.find((user) => user.userId === receiverId);
            console.log('usse', user);
            if (user) {
                console.log('senđd');
                io.to(user.socketId).emit("recall-message-receive", data);
                console.log(data);
            }
        }
    })

    // pin Message
    socket.on('pinMessage', (data) => {
        const { receiverId, da } = data;
        // log(receiverId)
        if (Array.isArray(receiverId)) {
            receiverId.forEach(id => {
                const user = activeUsers.find((user) => user.userId === id);
                // console.log('us', user)
                if (user) {
                    io.to(user.socketId).emit('receive-pinMessage', data);
                }
            });
        }
        else
        {
            const user = activeUsers.find((user) => user.userId === receiverId);
            if (user) {
                io.to(user.socketId).emit('receive-pinMessage', data);
            }
        }

    });
    // unPin message
    socket.on('unPinMessage', (data) => {
        const { receiverId, da } = data;
        // log(receiverId)
        if (Array.isArray(receiverId)) {
            receiverId.forEach(id => {
                const user = activeUsers.find((user) => user.userId === id);
                // console.log('us', user)
                if (user) {
                    io.to(user.socketId).emit('receive-unpinMessage', data);
                }
            });
        }
        else
        {
            const user = activeUsers.find((user) => user.userId === receiverId);
            if (user) {
                io.to(user.socketId).emit('receive-unpinMessage', data);
            }
        }

    });


    // add member group
    
    socket.on('disconnect', () => {
        console.log('offline')
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        io.emit('get-users', activeUsers)
    });
});


module.exports = io;