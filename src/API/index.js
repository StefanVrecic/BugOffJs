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

const checkBugOverdue = async () => {
    const bugs = await Bug.find({dueDate:{$ne:null}, dueDatePassed:{$ne:true}});
    // const bugs = await Bug.find();
    let items = 0;
    const now = new Date();
    for( const c of bugs) {
        console.log(c.dueDate + " / " + now);
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
    }
    console.log("Completed check for deadlines: " + now);
    if (items > 0) {
        console.log(items + " items have reached their deadline")
    } else {
        console.log("Nothing has reached it's deadline yet")
        console.log();
    }
}
    
setInterval(checkBugOverdue, 15000);




module.exports = app;