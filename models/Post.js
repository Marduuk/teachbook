const mongoose = require('mongoose');
const { Comment, commentSchema } = require('./Comment');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    comments: [commentSchema],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;