const Message = require('../models/Message');
const {bucketName, s3} = require('../helper/imageUpload');
const MyError = require('../exception/MyError');
const Chat = require('../models/Chat');
const User = require('../models/User');

exports.addMessage = async (req, res) => {
    const {chatId, senderId, text, replyTo} = req.body;
    console.log("test", text);
    const message = new Message({
        chatId,
        senderId,
        text,
        type: 'text',
        isRead: [senderId],
        ...(replyTo && {replyTo})
    });
    try
    {
        const result = await message.save();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
};

//upload đơn
// exports.sendMessageImage = async(req, res) => {
//     const {chatId, senderId} = req.body;
//     let imageUrl = null;

//     console.log('loading: ', req.file.buffer);
//     if (req.file) {
//         try {
//             const fileBuffer = req.file.buffer;
//             console.log('load2', req.file.originalname);
//             // Tải hình ảnh lên S3 và lấy URL
//             const params = {
//                 Bucket: bucketName,
//                 Key: `${senderId}_images/${Date.now()}.jpg`,
//                 Body: fileBuffer,
//                 ContentType: req.file.mimetype,
//             };
//             imageUrl = await s3.upload(params).promise();
//         } catch (error) {
//             return res.status(500).json({ message: 'Error uploading image', error });
//         }
//     }

//     // Kiểm tra nếu không có hình ảnh được tải lên
//     if (!imageUrl) {
//         return res.status(400).json({ message: 'No image provided' });
//     }

//     // Tạo đối tượng message mới với URL hình ảnh
//     const message = new Message({
//         chatId,
//         senderId,
//         text: imageUrl.Location, // URL hình ảnh
//         type: 'image', // Đặt loại tin nhắn là 'image'
//         // isDelete: false
//     });

//     try {
//         const result = await message.save();
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// };

// upload mảng video + ảnh
exports.sendMessageImage = async(req, res) => {
    const { chatId, senderId } = req.body;
    let mediaUrls = [];
    
    if (req.files) {
        console.log('load1 ', req.files);
        try {
            // Xử lý mỗi tệp trong req.files
            for (const file of req.files) {
                const fileBuffer = file.buffer;
                
                const fileExtension = file.originalname.split('.').pop();
                const mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';
                const keyName = `${senderId}_${mediaType}s/${Date.now()}.${fileExtension}`;
                console.log('load3', file.mimetype);
                // Tải lên S3 và lấy URL
                const params = {
                    Bucket: bucketName,
                    Key: keyName,
                    Body: fileBuffer,
                    ContentType: file.mimetype,
                };
                const uploadResult = await s3.upload(params).promise();
                console.log('load2');
                mediaUrls.push({
                    url: uploadResult.Location,
                    type: mediaType,
                });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error uploading media', error });
        }
    }

    // Kiểm tra nếu không có media nào được tải lên
    if (mediaUrls.length === 0) {
        return res.status(400).json({ message: 'No media provided' });
    }

    // Tạo và lưu các đối tượng message mới với URLs của media
    try {
        const message = new Message({
            chatId,
            senderId,
            text: '', // Đặt text là rỗng vì đây là media
            mediaUrl: mediaUrls, // Lưu mảng URLs vào trường mediaUrl
            type: 'media'
        });

        // Lưu message vào cơ sở dữ liệu
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error });
    }

}


// exports.getMessages = async(req, res) => {
//     const {chatId} = req.params;

//     try
//     {
//         const result = await Message.find({chatId});
//         res.status(200).json(result);
//     }
//     catch (error) {
//         res.status(500).json(error);
//     }
// }

exports.getMessages = async(req, res) => {
    const { chatId, userId } = req.params; // Thêm tham số userId
    console.log(userId);
    try {
        // Tìm tất cả tin nhắn trong chat mà không bị người dùng này xoá
        const result = await Message.find({
            chatId,
            deleteByMembers: { $ne: userId } // Kiểm tra nếu userId không nằm trong deleteByMembers
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};

// Thu hồi tin nhắn
exports.recallMessage = async (req, res) => {
    const { messageId, senderId } = req.body;

    try {
        // Tìm tin nhắn theo ID
        const message = await Message.findById(messageId);

        // Kiểm tra xem người gửi có phải là người thu hồi không
        if (message.senderId !== senderId) {
            return res.status(403).json({ message: 'Bạn không có quyền thu hồi tin nhắn này.' });
        }

        // Kiểm tra loại tin nhắn và cập nhật nội dung tương ứng
        if (message.type === 'text') {
            message.text = 'Đã thu hồi 1 tin nhắn';
        } else if (message.mediaUrl.length > 0) {
            message.mediaUrl = []; // Xóa mediaUrl
            message.text = 'Đã thu hồi 1 file';
        }
        message.type = 'recall'; // Cập nhật loại tin nhắn là 'recall'

        // Lưu thay đổi vào cơ sở dữ liệu
        const updatedMessage = await message.save();
        // res.status(200).json(updatedMessage);
        return res.status(200).json({ success: true, updatedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thu hồi tin nhắn', error });
    }
};

// xoá message 1 bên
exports.deleteOneMessage = async(req, res) => {
    const { message_id, _id } = req.body;
    console.log(message_id);

    try {
        // Kiểm tra xem người dùng có trong danh sách members của chat không
        const chat = await Chat.findOne({
            members: { $in: [_id] }
        });

        // Nếu người dùng không có trong chat, trả về lỗi
        if (!chat) {
            return res.status(403).json({ message: 'User not authorized to delete this message' });
        }

        // Nếu người dùng có trong chat, tiếp tục xoá tin nhắn
        const result = await Message.findOneAndUpdate(
            { _id: message_id },
            { $addToSet: { deleteByMembers: _id } },
            { new: true }
        );

        if (result) {
            res.status(200).json({ success: true, result });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message for user', error });
    }
};

// ghim tin nhắn
exports.pinMessage = async (req, res) => {
    const { chatId, messageId, userId } = req.body;

    try {
        // Tìm cuộc trò chuyện và kiểm tra xem userId có trong members không
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.members.includes(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user or chat not found' });
        }

        // Kiểm tra xem messageId đã được ghim chưa
        const isAlreadyPinned = chat.pinnedMessages.some(pinned => pinned.messageId.toString() === messageId);

        if (isAlreadyPinned) {
            return res.status(400).json({ success: false, message: 'Message already pinned' });
        }

        // Cập nhật danh sách pinnedMessages
        const result = await Chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { pinnedMessages: { messageId, userId } } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Message pinned successfully', result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error pinning message', error });
    }
};
// Bỏ pin 
exports.unpinMessage = async (req, res) => {
    const { chatId, messageId } = req.body;

    try {
        // Tìm cuộc trò chuyện và kiểm tra xem messageId có trong pinnedMessages không
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        // Kiểm tra xem messageId có được ghim không
        const isPinned = chat.pinnedMessages.some(pinned => pinned.messageId.toString() === messageId);
        if (!isPinned) {
            return res.status(400).json({ success: false, message: 'Message not pinned' });
        }

        // Cập nhật danh sách pinnedMessages bằng cách loại bỏ messageId
        const result = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { pinnedMessages: { messageId: messageId } } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Message unpinned successfully', result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error unpinning message', error });
    }
};


// get Pin
exports.getPinnedMessagesDetails = async(req, res) => {
    const { chatId } = req.params;

    try {
        // Find the chat by chatId and get the pinnedMessages
        const chat = await Chat.findById(chatId);

        if (!chat || !chat.pinnedMessages || chat.pinnedMessages.length === 0) {
            return res.status(404).json({ success: false, message: 'No pinned messages found for this chat' });
        }

        // Collect information for each pinned message
        const pinnedMessagesDetails = await Promise.all(chat.pinnedMessages.map(async (pinned) => {
            const message = await Message.findById(pinned.messageId);
            if (!message) {
                return null; // Skip if message not found
            }

            const user = await User.findById(message.senderId);
            if (!user) {
                return null; // Skip if user not found
            }

            return {
                messageId: message._id,
                text: message.text,
                type: message.type,
                mediaUrl: message.mediaUrl,
                userName: user.userName, // Assuming userName is a field in the User model
            };
        }));

        // Filter out any null values if message or user was not found
        const filteredPinnedMessagesDetails = pinnedMessagesDetails.filter(details => details !== null);

        // Check if the filtered results array is empty
        if (filteredPinnedMessagesDetails.length === 0) {
            return res.status(200).json({ success: false, message: 'No pinned messages details found', pinnedMessagesDetails: [] });
        }

        res.status(200).json({ success: true, pinnedMessagesDetails: filteredPinnedMessagesDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching pinned messages details', error });
    }
};

// Đánh dấu đã đọc tin nhắn
exports.markAsRead = async (req, res) => {
    const { chatId, userId } = req.body;
    console.log('cha', chatId);

    try {
        // Cập nhật tất cả tin nhắn trong cuộc trò chuyện là đã đọc bởi userId
        await Message.updateMany(
            { chatId, isRead: { $ne: userId } },
            { $push: { isRead: userId } }
        );

        res.status(200).json({ success: true, message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error marking messages as read', error });
    }
};
