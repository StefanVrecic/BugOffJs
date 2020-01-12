const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const bugRouter = require('./routers/bug');

const app = express();

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());

app.use(express.urlencoded({ extended: false }))

// app.use(cookieParser())

app.use(bugRouter);
app.use(userRouter);

app.use(cors());

const port = process.env.PORT;
// const app = require('./app');

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
    let reminderMessage = "";
    const now = new Date();
    for( const c of bugs) {
        console.log(c.dueDate + " / " + now);
        console.log(c.allowReminder + " / " + c.reminderTimer);
        const reminderTime = c.dueDate - ((c.reminderTimer) * 3600000);
        const reminderDate = new Date(reminderTime);
        console.log("Remind: " + reminderDate);
        console.log("Due: " + new Date(c.dueDate));
        console.log("Now: " + now);
        if (c.dueDate < now) {
            console.log("===============================================")
            console.log("===============================================")
            c.dueDatePassed = true; 
            c.overdueConfirmed = false; // user has acknowledged that they know it's past deadline
            c.save();
            items++;
            // calling a notification or sending an email is okay here.
            // however, there is no logic describing whether the user wants a reminder ahead of time e.g., 6 hours?
            // also the MongoDB seems to be off 1 hour.
            // E.g., 1.45pm on my computer, if I put 1.45pm into the Robo 3T, this will register as 2.45pm
        }
        if (c.allowReminder === true && reminderDate < now) {
            c.allowReminder = false;
            c.save();
            reminderMessage = c.name + " reminder for " + c.dueDate 
            + ". You are being reminded " + c.reminderTimer + " hours in advance."
            sendEmail(reminderMessage, c.owner);
        }
    }
    // console.log("Completed check for deadlines: " + now);
    console.log("Completed check for deadlines: ");
    if (items > 0) {
        console.log(items + " items have reached their deadline")
    } else {
        console.log("Nothing has reached it's deadline yet")
        console.log();
    }
}
    
setInterval(checkBugOverdue, 5000);

const sendEmail = async (msg, userId) => {
    console.log(msg + userId);
    try {
        const user = await User.findOne({ _id: userId});
        // sendgrid call here
    } catch (e) {
        console.log(e + " sendEmail error");
    }
}



module.exports = app;