const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        console.log(req.header);
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        
        if (!user) {
            console.log("no user!");
            throw new Error()
        }
        
        req.token = token
        req.user = user
        // console.log("auth6 " + req.user._id + token);
        next()
    } catch (e) {
        console.log("please authenticate");
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth