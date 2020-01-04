const express = require('express');
const axios = require('axios');
var bodyParser = require('body-parser');
var cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const bugRouter = require('./routers/bug');
const cookieParser = require('cookie-parser')

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

const main = async () => {
    const user = await User.findById("5e1010ec9a353812f0e6b025");
    await user.populate('bugs').execPopulate();
    console.log(user.bugs);
}
    
    main();

// const User = require('./models/user');

// app.post('/users', cors(), async (req, res) => {
//     const user = new User(req.body)

//     try {
//         await user.save();
//         // sendWelcomeEmail(user.email, user.name)
//         const token = await user.generateAuthToken();
//         res.status(201).send({ user, token });
//     } catch (e) {
//         res.status(400).send(e);
//     }
// })



// function connectBack() {
//     const data = { name: 'example', email: `fetchTestBlahBlah@gmail.com`, password: "123123123" };
//     fetch('/users', {
//         method: 'POST', // or 'PUT'
//         headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Success:', data);
//   })
//   .catch((error) => {
//       console.error('Error:', error);
//     });
// }
    


// axios.post('/users', {
//     "name": "axiosTestName",
//         "email": "axios@gmail.com",
//         "password": "123123123"
//     }, {
//         proxy: { port: 3000 }
//     }
//     ).then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error.config.data);
//           });
          



module.exports = app;