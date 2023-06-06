const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/nodes');
const dataRouter = require('./routes/data.js');
const {NotFoundError} = require("@wyf-ticketing/wyf");

const app = express();
const corsOptions = {
  origin: 'http://localhost:3001',
  methods:['POST', 'GET'],
  credentials:true,
  optionSuccessStatus: 200
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use(indexRouter);
app.use(usersRouter);
app.use(dataRouter);

// error handler
app.get('*',async (req,res)=>{
  throw new NotFoundError('Not Found');
});

module.exports = app;
