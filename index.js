const mongoose = require('mongoose');
const {College} = require('./models/index.js');
const { glob } = require('glob');
const { basicErrorHandler } = require('./utility/error-handlers');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/cgpa_book",{useNewUrlParser : true , useUnifiedTopology : true})
    .catch(basicErrorHandler);
