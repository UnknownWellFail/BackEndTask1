import createError from 'http-errors';
import express from 'express'

import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/api/comments';

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/comments', indexRouter);

app.use(function (req, res, next) {
  res.status(404).send('404');
  next(createError(404));
});

app.use(function (err, req, res) {
  res.status(err.status || 500).send(err.message);
});


module.exports = app;
