const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const bugRouter = require('./routers/bug');
const sgMail = require('@sendgrid/mail')

const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.use(bugRouter);
app.use(userRouter);
app.use(cors());

const port = process.env.PORT;
// const host = "0.0.0.0";

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


const Bug = require('./models/bug');
const User = require('./models/user');

const checkBugOverdue = async () => {
    const bugs = await Bug.find({dueDate:{$ne:null}, dueDatePassed:{$ne:true}, dueDateEnabled:{$ne:false},
    status:{$ne:'Closed'}});
    // const bugs = await Bug.find();
    let items = 0;
    let waiting = 0;
    let reminderMessage = "";
    const now = new Date();
    for( const c of bugs) {

        const reminderTime = c.dueDate - ((c.reminderTimer) * 3600000);
        const reminderDate = new Date(reminderTime);
        
        if (c.dueDate < now) {
            c.dueDatePassed = true; 
            c.overdueConfirmed = false; // user has acknowledged that they know it's past deadline
            items++;
        }

        if (c.allowReminder === true && reminderDate < now) {
            if (c.reminderTimer < 1 || c.reminderTimer > 48) { // only  valid between 1 and 48
                continue;
            }
            c.allowReminder = false;
            reminderMessage = c.name + " reminder for " + c.dueDate 
            + ". You are being reminded " + c.reminderTimer + " hours in advance."
            sendEmail(c.name + " reminder", reminderMessage, c.owner);
        }
        waiting++;
        c.save();
    }
    
    console.log("Completed check for deadlines: ");
    if (items > 0) {
        console.log(items + " items have reached their deadline")
    } else {
        console.log(waiting + " items waiting for deadline");
}
    
}

setInterval(checkBugOverdue, 100000);


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendEmail = async (emailSubject, msg, userId) => {
    console.log(msg + userId + " SENDING SENDING SENDING SENDING");
    try {
        const user = await User.findOne({ _id: userId});
        sgMail.send({
            to: user.email,
            from: 'vstefan9@gmail.com',
            subject: "BugSquash reminder: " + emailSubject,
            text: msg
        })
    } catch (e) {
        console.log(" sendEmail error");
    }
}



module.exports = app;