const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const ChatService = require('../services/chatService');
const { getConversation } = require('../services/chatService');

// chat đơn
exports.createChat = async(req, res) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId]
    })
    try {
        const result = await newChat.save();
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }   
};

exports.userChats = async(req, res) => {
    try
    {
        const chat = await Chat.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error)
    }   
};

exports.findChat = async (req, res) => {
    try
    {
        const chat = await Chat.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        });
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error)
    }  
};

exports.getListByUserId = async (req, res) => {
    try
    {
        const userId = req.params.userId;
        const chats = await Chat.getListByUserId(userId);
        res.status(200).json({success: true, data: chats});
    }
    catch (error) {
        res.status(500).json(error)
    }  
}

// exports.getConversition = async (req, res) =>{
//     try {
//         const currentUserId = req.params.userId;
//         // Tìm tất cả các đoạn chat chứa userId hiện tại
//         const chats = await Chat.find({ members: { $all: [currentUserId] } });
        
//         // Lấy thông tin người dùng và tin nhắn từ mỗi chatId
//         const chatMessages = await Promise.all(chats.map(async (chat) => {
//             const otherUserId = chat.members.find(member => member !== currentUserId);
//             const user = await User.findById(otherUserId).select('avatar userName -_id');
//             const messages = await Message.find({ chatId: chat._id }).select('text createdAt -_id mediaUrl senderId').limit(1).sort({ createdAt: -1 });
            
//             // Chỉ trả về thông tin nếu có tin nhắn (text không phải là null)
//             if (messages.length > 0) {
//                  // Tìm thông tin người gửi tin nhắn mới nhất
//                 const sender = await User.findById(messages[0].senderId).select('userName -_id');
//                 const senderUserName = sender ? sender.userName : "Không xác định";
                
//                 return {
//                     chatId: chat._id,
//                     members: chat.members,
//                     avatar: user.avatar,
//                     userName: user.userName,
//                     text: messages[0].text,
//                     lastMessageTime: messages[0].createdAt,
//                     mediaUrl: messages[0].mediaUrl,
//                     groupName: chat.groupName,
//                     groupAvatar: chat.groupAvatar,
//                     type: chat.type,
//                     senderUserName: senderUserName
//                 };
//             }
//         }));

//         // Lọc ra những đối tượng không có tin nhắn và trả về kết quả
//         // res.json(chatMessages.filter(message => message !== undefined));
//         const filteredChatMessages = chatMessages.filter(message => message !== undefined);
//         // Sắp xếp các cuộc trò chuyện theo thời gian nhận tin nhắn mới nhất
//         const sortedChatMessages = filteredChatMessages.sort((a, b) => {
//             // Chuyển đổi thời gian từ chuỗi sang đối tượng Date
//             const dateA = new Date(a.lastMessageTime);
//             const dateB = new Date(b.lastMessageTime);
        
//             // So sánh thời gian để sắp xếp giảm dần
//             return dateB - dateA;
//         });
        
//           // Trả về kết quả đã sắp xxếp
//           res.json(sortedChatMessages);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi máy chủ khi truy xuất dữ liệu.' });
//     }
// };

// exports.getConversition = async (req, res) => {
//     try {
//         const currentUserId = req.params.userId;
//         // Tìm tất cả các đoạn chat chứa userId hiện tại
//         const chats = await Chat.find({ members: { $all: [currentUserId] } });

//         // Lấy thông tin người dùng và tin nhắn từ mỗi chatId
//         const chatMessages = await Promise.all(chats.map(async (chat) => {
//             const otherUserId = chat.members.find(member => member !== currentUserId);
//             const user = await User.findById(otherUserId).select('avatar userName -_id');
            
//             // Tìm tin nhắn mới nhất không bị currentUserId xoá
//             const messages = await Message.find({
//                 chatId: chat._id,
//                 deleteByMembers: { $ne: currentUserId }
//             }).select('text createdAt -_id mediaUrl senderId').limit(1).sort({ createdAt: -1 });

//             // Chỉ trả về thông tin nếu có tin nhắn (text không phải là null)
//             if (messages.length > 0) {
//                 // Tìm thông tin người gửi tin nhắn mới nhất
//                 const sender = await User.findById(messages[0].senderId).select('userName -_id');
//                 const senderUserName = sender ? sender.userName : "Không xác định";

//                 return {
//                     chatId: chat._id,
//                     members: chat.members,
//                     avatar: user.avatar,
//                     userName: user.userName,
//                     text: messages[0].text,
//                     lastMessageTime: messages[0].createdAt,
//                     mediaUrl: messages[0].mediaUrl,
//                     groupName: chat.groupName,
//                     groupAvatar: chat.groupAvatar,
//                     type: chat.type,
//                     senderUserName: senderUserName
//                 };
//             }
//         }));

//         // Lọc ra những đối tượng không có tin nhắn và trả về kết quả
//         const filteredChatMessages = chatMessages.filter(message => message !== undefined);
//         // Sắp xếp các cuộc trò chuyện theo thời gian nhận tin nhắn mới nhất
//         const sortedChatMessages = filteredChatMessages.sort((a, b) => {
//             // Chuyển đổi thời gian từ chuỗi sang đối tượng Date
//             const dateA = new Date(a.lastMessageTime);
//             const dateB = new Date(b.lastMessageTime);

//             // So sánh thời gian để sắp xếp giảm dần
//             return dateB - dateA;
//         });

//         // Trả về kết quả đã sắp xếp
//         res.json(sortedChatMessages);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi máy chủ khi truy xuất dữ liệu.' });
//     }
// };

exports.getConversition = async (req, res) => {
    try {
        const currentUserId = req.params.userId;
        // Tìm tất cả các đoạn chat chứa userId hiện tại
        const chats = await Chat.find({ members: { $all: [currentUserId] } });

        // Lấy thông tin người dùng và tin nhắn từ mỗi chatId
        const chatMessages = await Promise.all(chats.map(async (chat) => {
            const otherUserId = chat.members.find(member => member !== currentUserId);
            const user = await User.findById(otherUserId).select('avatar userName -_id');
            
            // Tìm tin nhắn mới nhất không bị currentUserId xoá
            const messages = await Message.find({
                chatId: chat._id,
                deleteByMembers: { $ne: currentUserId }
            }).select('text createdAt -_id mediaUrl senderId isRead').limit(1).sort({ createdAt: -1 });

            // Đếm số lượng tin nhắn chưa đọc
            const unreadMessagesCount = await Message.countDocuments({
                chatId: chat._id,
                isRead: { $nin: [currentUserId] }, // Kiểm tra nếu currentUserId không nằm trong mảng isRead
                deleteByMembers: { $ne: currentUserId }
            });

            // Chỉ trả về thông tin nếu có tin nhắn (text không phải là null)
            if (messages.length > 0) {
                // Tìm thông tin người gửi tin nhắn mới nhất
                const sender = await User.findById(messages[0].senderId).select('userName -_id');
                const senderUserName = sender ? sender.userName : "Không xác định";

                return {
                    chatId: chat._id,
                    members: chat.members,
                    avatar: user.avatar,
                    userName: user.userName,
                    text: messages[0].text,
                    lastMessageTime: messages[0].createdAt,
                    mediaUrl: messages[0].mediaUrl,
                    groupName: chat.groupName,
                    groupAvatar: chat.groupAvatar,
                    type: chat.type,
                    senderUserName: senderUserName,
                    unreadmessages: unreadMessagesCount // Thêm số lượng tin nhắn chưa đọc
                };
            }
        }));

        // Lọc ra những đối tượng không có tin nhắn và trả về kết quả
        const filteredChatMessages = chatMessages.filter(message => message !== undefined);
        // Sắp xếp các cuộc trò chuyện theo thời gian nhận tin nhắn mới nhất
        const sortedChatMessages = filteredChatMessages.sort((a, b) => {
            // Chuyển đổi thời gian từ chuỗi sang đối tượng Date
            const dateA = new Date(a.lastMessageTime);
            const dateB = new Date(b.lastMessageTime);

            // So sánh thời gian để sắp xếp giảm dần
            return dateB - dateA;
        });

        // Trả về kết quả đã sắp xếp
        res.json(sortedChatMessages);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi truy xuất dữ liệu.' });
    }
};



// create group
exports.createGroupChat = async (req, res) => {
    const { userId, members, groupName } = req.body;

    // Kiểm tra xem có đủ thành viên
    if (!members || members.length < 2) {
        return res.status(400).json({success: false, message: "Cần ít nhất 2 thành viên để tạo nhóm." });
    }

    // Thêm người tạo vào danh sách thành viên nếu chưa có
    if (!members.includes(userId)) {
        members.push(userId);
    }

    // Tìm thông tin người dùng từ bảng User
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({success: false, message: "Không tìm thấy người dùng."});
    }
    const userName = user.userName; // Hoặc tên trường tương ứng chứa tên người dùng

    // Tạo chat nhóm mới
    const newGroupChat = new Chat({
        members: members,
        groupName: groupName || 'Group',
        type: 'group',
        isAdmin: userId
    });

    try {
        const savedGroupChat = await newGroupChat.save();

        // Tạo tin nhắn thông báo đã thêm vào nhóm
        const welcomeMessage = new Message({
            chatId: savedGroupChat._id,
            senderId: userId,
            text: `${userName} đã thêm bạn vào nhóm`,
            type: 'notification',
            isDelete: false
        });

        await welcomeMessage.save();

        res.status(200).json(savedGroupChat);
    } catch (error) {
        res.status(500).json(error);
    }
};


// thêm thành viên
exports.addMemberToGroup = async (req, res) => {
    const { chatId, newMemberId } = req.body;
    const userId = req.user.id; // Giả sử bạn đã xác thực người dùng và có ID của họ

    try {
        // Tìm chat nhóm bằng chatId
        const chat = await Chat.findById(chatId);

        // Kiểm tra xem người dùng hiện tại có phải là admin của nhóm không
        if (chat.isAdmin.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền thêm thành viên vào nhóm này." });
        }

        // Kiểm tra xem người được thêm đã là thành viên của nhóm chưa
        if (chat.members.includes(newMemberId)) {
            return res.status(400).json({ message: "Người dùng này đã là thành viên của nhóm." });
        }
        // console.log(newMemberId);

        // Thêm người dùng mới vào mảng members
        // chat.members.push(newMemberId);
        // Duyệt qua mảng newMemberIds và thêm từng ID vào mảng members
        newMemberId.forEach(memberId => {
            if (!chat.members.includes(memberId)) {
                chat.members.push(memberId);
            }
        });

        // Lưu thay đổi vào cơ sở dữ liệu
        await chat.save();

        res.status(200).json({success: true, message: "Thành viên mới đã được thêm vào nhóm." });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra khi thêm thành viên." });
    }
};

// xoá thành viên khỏi group
exports.removeMemberFromGroup = async (req, res) => {
    const { chatId, memberId } = req.body; // chatId là ID của nhóm chat, memberId là ID của thành viên cần xóa

    try {
        // Tìm nhóm chat dựa trên chatId
        const chat = await Chat.findById(chatId);

        // Kiểm tra xem người dùng hiện tại có phải là admin của nhóm không
        if (chat.isAdmin.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa thành viên khỏi nhóm này." });
        }

        // Loại bỏ memberId khỏi mảng members
        chat.members = chat.members.filter(member => member.toString() !== memberId);

        // Lưu thay đổi vào cơ sở dữ liệu
        await chat.save();

        res.status(200).json({ success: true, message: "Thành viên đã được xóa khỏi nhóm." });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra khi xóa thành viên." });
    }
};

