const express = require('express');
const morgan = require('morgan');
const errors = require('./middlewares/errors');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('combined'));

app.use((req,res,next) => {
    console.log("req.params =",req.params);
    console.log("req.headers =",req.headers);
    console.log("req.body =",req.body);
    next();
});

app.use('/academia', require('./routes/academia.js'));
// app.use('/users',require('./routers/uses.js'))

app.get('/', (req, res) => {
    res.status(200).send('Okaeri');
})


app.use(errors.notFoundHandler);
app.use(errors.logErrors);
app.use(errors.genericErrorHandler);
module.exports = app;