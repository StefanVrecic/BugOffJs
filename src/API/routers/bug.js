const express = require('express')
const Bug = require('../models/bug')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/bugs',  async (req, res) => {
    
    const bug = new Bug({
        ...req.body,
        owner: req.user._id
    })

    try {
        await bug.save()
        res.status(201).send(bug)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/bugs/:id', auth, async (req, res) => {
    
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



module.exports = router