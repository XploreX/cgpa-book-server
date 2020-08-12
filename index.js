const express = require('express');
const morgan = require('morgan');
const {logErrors,genericErrorHandler} = require('./middlewares/errors');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/academia',require('./routers/academia.js'));
// app.use('/users',require('./routers/uses.js'))

app.use(logErrors);
app.use(genericErrorHandler);
module.exports = app;