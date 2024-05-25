require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
// route
const userRouter = require('./routes/user');
const friendRequestRouter = require('./routes/FriendRequest');
const friendRouter = require('./routes/friend');
const chatRouter = require('./routes/chat');
const messageRouter = require('./routes/message');
const postRouter = require('./routes/post');
const otpRouter = require('./routes/otp');
// 

const db = require('./config/db');
const port = process.env.PORT;  


const app = express();
const useragent = require('express-useragent');
db.connect();

app.use(cors());
app.use(useragent.express());

app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));


const server = http.createServer(app);
// const socket = require('socket.io');
// const io = require('socket.io')(server);
// io.on("connection", function(socket){
//     console.log('Có người vừa kết nối' + socket.id);
//     socket.on("friendRequestNotification", function(data){
//         console.log("server nhận được: ", data);
//         io.sockets.emit("server-send-color", 'cc');
//     })
// })
// endsocket

// const {
//     Server
// } = require('socket.io');
// const io = new Server(server);

server.listen(port, function() {
    console.log('App listening at http://localhost:' + port);
})

module.exports = server;


app.get('/', (req, res) => {
    res.json({success: true, message: 'welcome to backend zone!'})
})

// const User = require('./models/User');
// module.exports = io;
app.use(express.json());
app.use(userRouter);
app.use(friendRequestRouter);
app.use(friendRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);
app.use('/post', postRouter);
app.use('/otp', otpRouter);
app.get('/test', (req, res) => {
    res.send('Hello world');
})

const io = require('./socket/socket');
io.attach(server);

// mongodb+srv://YanuoApp:<password>@yanuoapp.rfm4w9p.mongodb.net/?retryWrites=true&w=majority&appName=YanuoApp