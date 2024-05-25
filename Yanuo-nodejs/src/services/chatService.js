const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const ChatService = {
    async getChatDetails(userId) {
        // Lấy danh sách các cuộc trò chuyện mà người dùng là thành viên
        const chats = await Chat.getListByUserId(userId);

        // Lấy thông tin chi tiết cho mỗi cuộc trò chuyện
        const chatDetails = await Promise.all(chats.map(async (chat) => {
            // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
            const lastMessage = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 });

            // Lấy thông tin người dùng cho người gửi tin nhắn cuối cùng
            const sender = await User.findById(lastMessage.senderId);

            return {
                avatar: sender.avatar,
                userName: sender.userName,
                text: lastMessage.text
            };
        }));

        return chatDetails;
    }
};

module.exports = ChatService;
