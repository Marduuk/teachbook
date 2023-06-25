const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');
const Post = require('../models/Post');

router.post('/groups/:groupId/posts', async (req, res) => {
    const token = req.header('Authorization')
    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }


    const groupId = req.params.groupId;
    const { title, content } = req.body;

    const authorId = user.id
    try {
        const group = await Group.findById(groupId);
        if (!group.members.includes(authorId)) {
            return res.status(400).json({message: 'You must be a member of the group to post'});
        }

        const post = new Post({ title, content, author: authorId, group: groupId });
        await post.save();

        group.posts.push(post._id);
        await group.save();

        res.status(201).json({message: 'Post successfully created', post: post});

    } catch (err) {
        return res.status(500).json({message: 'Something went baaaad', err});
    }
});


router.get('/groups/:groupId/posts', async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const posts = await Post.find({ group: groupId }).populate('author', 'username');
        res.status(201).json({message: 'Posts fetched successfully', post: posts});
    } catch (err) {
        return res.status(500).json({message: 'Something went baaaad', err});
    }
});






module.exports = router;
