const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');


router.post('/groups', async (req, res) => {
    const token = req.header('Authorization')
    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({message: 'Name and description are required'});
    }



    let group = await Group.findOne({ name });

    if (group !== null){
        return res.status(400).json({message: 'Group with that name already exists'});
    }

    try {
        const group = new Group({ name, description, members: [user.id], owner: user.id });
        await group.save();


        res.status(201).json({message: 'Group successfully created'});

    } catch (err) {
        return res.status(500).json({message: 'Something went baaaad', err});
    }
});


router.post('/groups/:groupId/join', async (req, res) => {
    const groupId = req.params.groupId;


    const token = req.header('Authorization')
    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }

    try {
        const group = await Group.findById(groupId);

        // if (group.members.includes(user.id)) {
        //     return res.status(400).json({message: 'You are already a member of this group'});
        // }

        group.members.push(user.id);
        await group.save();

        res.status(201).json({message: 'Successfully joined the group', group: group});

    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Something went baaaad', err});
    }
});




router.post('/groups/:groupId/leave', async (req, res) => {
    const token = req.header('Authorization')
    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }


    const groupId = req.params.groupId;
    const userId = user.id;

    try {
        const group = await Group.findById(groupId);

        if (!group.members.includes(userId)) {
            return res.status(400).json({message: 'You are not a member of this group'});
        }

        if (group.owner === userId) {
            return res.status(400).json({message: 'Kapitan nie moze opuscic wlasnej grupy!'});
        }

        group.members = group.members.filter(id => id.toString() !== userId);
        await group.save();


        res.status(201).json({message: 'Successfully left the group'});


    } catch (err) {
        res.status(500).send({message: 'An error occurred while leaving the group', err});
    }
});

router.get('/groups', async (req, res) => {
    try {
        const groups = await Group.find({});

        res.status(200).json({message: 'Groups fetched successfully', groups: groups});


    } catch (err) {
        res.status(500).send({message: 'An error occurred while fetching groups', err});
    }
});





module.exports = router;
