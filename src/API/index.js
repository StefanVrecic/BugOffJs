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
    
    const now = new Date();
    for( const c of bugs) {
        if (c.dueDate < now) {
            c.dueDatePassed = true; 
            c.overdueConfirmed = false; // user has acknowledged that they know it's past deadline
            c.save();
        }
    }
    console.log("Completed check for deadlines");
}
    
setInterval(checkBugOverdue, 60000);




module.exports = app;