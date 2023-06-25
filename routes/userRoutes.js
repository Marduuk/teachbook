const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



router.post('/register', async (req, res) => {
    console.log(req.body)

    const { name, username, password } = req.body;


    let user = await User.findOne({ username });

    if (user) {
        return res.status(400).json({message: 'User with this username already exists'});
    }

    const token =  crypto.randomBytes(27).toString('hex')
    user = new User({ name, username, password, token });

    try {
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!password) {
        return res.status(400).json({message: 'No password sent'});
    }

    if (!user) {
        var dua = 'jakiestamrandomowehaslo'
    } else {
        var dua = user.password;
    }

    const isMatch = await bcrypt.compare(password, dua);

    if (!isMatch) {
        return res.status(400).json({message: 'Invalid password or username'});
    }

    const tokenik = user.token
    console.log(tokenik)
    res.json({ message: 'User logged in successfully',  token: tokenik });
});

// router.get('/show/:username', async (req, res) => {
//     const { username } = req.params;
//
//     const user = await User.findOne({ username });
//
//     if (!user) {
//         return res.status(404).json({message: 'User not found'});
//     }
//
//     res.send(user);
// });

router.get('/show/me', async (req, res) => {

    const token = req.header('Authorization')
    if (!token) {
        return res.status(400).json({message: 'No token sent'});
    }
    let cleanedToken = token.replace("Bearer ", "");


    const user = await User.findOne({ token: cleanedToken });

    console.log(user)
    console.log(cleanedToken)
    if (!user){
        return res.status(401).json({message: 'Unauthorized'});
    }


    res.send(user);
});


router.put('/edit/me', async (req, res) => {

    const token = req.header('Authorization')
    const { name, username, password } = req.body;

    if (!token) {
        return res.status(400).json({message: 'No token sent'});
    }
    let cleanedToken = token.replace("Bearer ", "");




    const user = await User.findOne({ token: cleanedToken });

    if (!user) {
        return res.status(403).json({message: 'You do not have permission to update this user'});
    }

    console.log(name)
    try {

        if (name) {
            console.log('midziala')
            user.name = name;
        }
        if (username) {
            user.username = username;
        }

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const userNew = await user.save()

        console.log('yeyyeye')
        console.log(userNew)

        res.json({ message: 'User editted',  user: userNew });

    } catch (error) {
        res.json({ message: 'Wyjebalo sie',  error: error.message });
    }
});

module.exports = router;