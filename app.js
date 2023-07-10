const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routers = require('./src/routers');

require('dotenv').config();

const app = express();

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// routes
app.use('/api/v1/auth', routers.authRouter);
app.use('/api/v1/users', routers.userRouter);

app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
});

module.exports = app;