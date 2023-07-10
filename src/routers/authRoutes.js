const router = require('express').Router();
const { login } = require('../handlers/auth');
const { 
    loginSchema
} = require('../schemas/auth');

const { validate } = require('../utils');

router
    .route('/login')
    .post(
        validate(loginSchema), 
        login
    );

module.exports = router;