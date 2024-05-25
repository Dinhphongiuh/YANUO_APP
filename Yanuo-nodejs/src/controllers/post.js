const {bucketName, s3} = require('../helper/imageUpload');
const Friend = require('../models/Friend');
const Post = require('../models/Post');

exports.createPost = async(req, res) => {
    const { content, userId, objectType } = req.body;

    try {
        const newPost = new Post({
            content,
            userId,
            objectType,
           
        });

        await newPost.save();

        // Gửi phản hồi thành công
        res.status(201).json(newPost);
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        res.status(400).json({ message: 'Không thể tạo bài đăng', error });
    }
};

exports.getListPost = async(req, res) => {
    const { userId } = req.params; // Hoặc req.body, tùy thuộc vào cách bạn gửi dữ liệu
    
    try {
        // Lấy danh sách ID của bạn bè
        const friendsList = await Friend.find({
            userIds: userId
        }).select('userIds -_id');

        
        // Tạo mảng chứa ID của người dùng và bạn bè
        const allUserIds = friendsList.map(friend => friend.userIds.find(id => id.toString() !== userId)).concat(userId);

        // Lấy và trộn lẫn các bài đăng của người dùng và bạn bè
        const posts = await Post.find({
            userId: { $in: allUserIds },
            objectType: { $in: ['public', 'friend'] }
        }).sort({ _id: -1 }); // Sắp xếp giảm dần theo ID để lấy bài đăng mới nhất

        const shuffledPosts = posts.sort(() => 0.5 - Math.random());

        console.log('list', posts);

        // Gửi phản hồi thành công
        res.status(200).json(posts);
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        res.status(400).json({ message: 'Không thể lấy danh sách bài đăng', error });
    }
}