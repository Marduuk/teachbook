const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    let user = await User.findOne({ username });

    if (user) {
        return res.status(400).send('User with this username already exists');
    }

    user = new User({ name, username, password });

    try {
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).send('Invalid username');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send('Invalid password');
    }

    req.session.username = username;

    res.send('User logged in successfully');
});

router.get('/show/:username', async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).send('User not found');
    }

    res.send(user);
});


router.put('/edit/:username', async (req, res) => {
    const { username } = req.params;
    const updates = req.body;

    if (req.session.username !== username) {
        return res.status(403).send('You do not have permission to update this user');
    }

    try {
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findOneAndUpdate({ username }, updates, { new: true });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;