'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { sequelize } = require('./models');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// test the connection to the database.
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database is successfull~');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
})();

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and renders 404.pug
app.use((req, res, next) => {
  res.status(404).render('404', { msg: 'Page', title: 'Page Not Found' });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
