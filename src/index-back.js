const express = require('express');
const axios = require('axios');
var bodyParser = require('body-parser')
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

const port = process.env.PORT;
// const app = require('./app');

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


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