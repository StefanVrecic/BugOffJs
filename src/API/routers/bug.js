const express = require('express')
const Bug = require('../models/bug')
const auth = require('../middleware/auth')
const router = new express.Router()
var cors = require('cors');
router.use(cors());

router.post('/bugs',  cors(), async (req, res) => {
    
    const bug = new Bug({
        ...req.body,
        // owner: req.user._id
    })

    try {
        await bug.save()
        res.status(201).send(bug)
    } catch (e) {
        console.log("failed?");
        res.status(400).send(e)
    }
})

router.get('/bugs', cors(), auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'bugs',
        }).execPopulate();
        res.send(req.user.bugs)
    } catch (e) {
        res.status(500).send()
    }
});

// add auth
router.get('/bugs/:id', async (req, res) => {
    try {
        const bug = await Bug.findOne({ _id: req.params.id})

        if (!bug) {
            return res.status(404).send("Bug does not exist")
        }
        
        
        res.send(bug)
    } catch (e) {
        res.status(400).send(e)
    } 
});

router.patch('/bugs/:id', async (req, res) => {
    
    const updates = Object.keys(req.body);
    // const allowedUpdates = ['description', 'completed'] // need to enforce updates by keys
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }

    try {
        const bug = await Bug.findOne({ _id: req.params.id})

        if (!bug) {
            return res.status(404).send("Bug does not exist")
        }
        updates.forEach((update) => bug[update] = req.body[update])
        await bug.save()
        res.send(bug)
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.delete('/bugs/:id', auth, async (req, res) => {
    try {
        const task = await Bug.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router