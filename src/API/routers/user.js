const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
// const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router();
var cors = require('cors');
router.use(cors());

router.post('/users', cors(), async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save();
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/users/login', cors(), async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log("login failed");
        res.status(400).send()
    }
})

router.patch('/users/changepass', cors(), async (req, res) => {
    try {
        console.log(req.body.newPassword)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log()
        user.password = req.body.newPassword;
        await user.save();
        res.send();
    } catch (e) {
        console.log("login failed");
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        console.log(req.user.name, "user logged out");
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


module.exports = router