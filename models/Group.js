const mongoose = require('mongoose');
const { User } = require('./User');
const { Comment } = require('./Comment');



const groupSchema = new mongoose.Schema({
    groupName: {type: String, required: true},
    description: {type: String, required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    icon: {type: String, required: true},
});


const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
