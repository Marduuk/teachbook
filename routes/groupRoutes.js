const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');


router.post('/groups', async (req, res) => {
    const token = req.header('Authorization')
    if (token === null || token === undefined) {
        return res.status(400).json({message: 'brakuje tokenu  Ola'});
    }
    console.log(token)

    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }
    const { groupName, description, icon } = req.body;
    if (!groupName || !description || !icon) {
        return res.status(400).json({message: 'Name and description are required'});
    }



    let group = await Group.findOne({ groupName });

    if (group !== null){
        return res.status(400).json({message: 'Group with that name already exists'});
    }

    try {
        const group = new Group({ groupName, description, members: [user.id], owner: user.id, icon: icon });
        await group.save();


        res.status(201).json({message: 'Group successfully created'});

    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Something went baaaad', err});
    }
});


router.post('/groups/:groupId/join', async (req, res) => {
    const groupId = req.params.groupId;

    const token = req.header('Authorization')
    if (token === null || token === undefined) {
        return res.status(400).json({message: 'brakuje tokenu  Ola'});
    }
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
    if (token === null || token === undefined) {
        return res.status(400).json({message: 'brakuje tokenu  Ola'});
    }
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

router.get('/user-groups', async (req, res) => {
    try {

        const token = req.header('Authorization')
        if (token === null || token === undefined) {
            return res.status(400).json({message: 'brakuje tokenu  Ola'});
        }


        let cleanedToken = token.replace("Bearer ", "");
        const user = await User.findOne({ token: cleanedToken });


        const groups = await Group.find({});
        console.log('foundGroup')



        let userGrp = [];
        groups.forEach(group => {
            group.members.forEach(member => {
                if (member.toString() === user.id){
                    userGrp.push(group);
                }

            });
        });
        // console.log('foundGroup')
        //
        // const foundGroup = groups.find(group =>
        //     group.members.find(member => member.id === user.id)  // Zamień 'c' na id, którego szukasz
        // );



        res.status(200).json({message: 'Successfully fetched user  groups', userGroups: userGrp});


    } catch (err) {
        res.status(500).send({message: 'An error occurred while fetching groups', err});
    }
});

router.delete('/group/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    const token = req.header('Authorization')
    if (token === null || token === undefined) {
        return res.status(400).json({message: 'brakuje tokenu  Ola'});
    }
    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }


    const grup = await Group.findOne({ id: groupId });
    console.log(grup)

    console.log(user._id)
    console.log(grup.owner)

    if (!user._id.equals(grup.owner)) {
        res.json({ message: 'Hola nie jestes ownerem grupy'});

    } else {


        Group.findByIdAndDelete(groupId, function (err, docs) {
            if (err) {
                res.json({message: 'Failed to delete', error: err});
                console.log(err)
            } else {
                res.json({message: 'Group deleted'});
            }
        });
    }

});
router.put('/group/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    const token = req.header('Authorization')
    if (token === null || token === undefined) {
        return res.status(400).json({message: 'brakuje tokenu  Ola'});
    }
    let cleanedToken = token.replace("Bearer ", "");
    const user = await User.findOne({ token: cleanedToken });

    if (user === null) {
        return res.status(400).json({message: 'Incorrect token'});
    }
    const { groupName, description, icon } = req.body;

    const grup = await Group.findOne({ id: groupId });

    if (!user._id.equals(grup.owner)) {
        res.json({ message: 'Hola nie jestes ownerem grupy'});

    } else {

        try {

            if (groupName) {
                console.log('midziala')
                grup.groupName = groupName;
            }
            if (description) {
                grup.description = description;
            }
            if (icon) {
                grup.icon = icon;
            }

            if (!grup) {
                return res.status(404).json({message: 'User not found'});
            }
            const grupnew = await grup.save()


            res.json({ message: 'Group editted',  group: grupnew });

        } catch (error) {
            res.json({ message: 'Wyjebalo sie',  error: error.message });
        }

    }

});



module.exports = router;
