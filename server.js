const mongoose = require('mongoose');

const __ROOT = './';
const app = require('./index.js');
const { basicErrorHandler } = require('./utility/error-handlers.js');


const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/cgpa_book";

console.log(DB_CONNECTION_STRING);

console.log("starting server");

mongoose.Promise = global.Promise;
mongoose.connect(DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex : true})
    .catch((err) => {
        basicErrorHandler(err,"Connection to mongo database failed");
    });

app.listen(PORT,()=> {
    console.log("server up and running");
})