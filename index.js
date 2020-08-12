const express = require('express');
const morgan = require('morgan');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/academia',require('./routers/academia.js'));
// app.use('/users',require('./routers/uses.js'))

module.exports = app;