const express = require('express');
const morganBody = require('morgan-body');
const errorMiddlewares = require('./middlewares/error');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.disable('etag');
// app.use(morgan('combined'));

app.use((req, res, next) => {
  console.log('req.query =', req.query);
  // console.log('req.params =', req.params);
  // console.log('req.headers =', req.headers);
  console.log('req.body =', req.body);
  next();
});

const morganBodyConfig = {
  logAllReqHeader: true,
  logResponseBody: true,
};
morganBody(app, morganBodyConfig);

app.use('/academia', require('./routes/academia'));
// app.use('/users',require('./routers/uses.js'))

app.get('/', (req, res) => {
  res.status(200).send('Okaeri');
});

app.use('/user', require('./routes/user'));

app.use(errorMiddlewares.notFoundHandler);
app.use(errorMiddlewares.logErrors);
app.use(errorMiddlewares.genericErrorHandler);
module.exports = app;
