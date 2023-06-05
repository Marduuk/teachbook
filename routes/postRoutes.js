const Post = require("../models/Post");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
});

router.post('/posts', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.send(savedPost);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/posts/:id/comments', async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new mongoose.model('Comment', commentSchema)(req.body);
    try {
        await comment.validate();
        post.comments.push(comment);
        const updatedPost = await post.save();
        res.send(updatedPost);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/posts/:id/comments', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.send(post.comments);
});
router.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.send(post);
});

router.put('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.set(req.body);
        const updatedPost = await post.save();
        res.send(updatedPost);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (deletedPost) {
            res.send(deletedPost);
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;