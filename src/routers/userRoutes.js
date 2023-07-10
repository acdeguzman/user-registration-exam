const router = require('express').Router();
const { 
    register, 
    getUser, 
    getUsers,
    updateUser,
    updatePassword,
    updateStatus,
    deleteUser
} = require('../handlers/users');

const { 
    registerUserSchema,
    getUserSchema, 
    getUsersSchema,
    updateUserSchema,
    updatePasswordSchema,
    updateStatusSchema,
    deleteUserSchema
} = require('../schemas/users');

const { validate, verifyToken } = require('../utils');

router
    .route('/')
    .get(
        validate(getUsersSchema),
        verifyToken,
        getUsers
    )
    .post(
        validate(registerUserSchema), 
        register
    );
    
router
    .route('/password')
    .patch(
        validate(updatePasswordSchema), 
        verifyToken,    
        updatePassword
    );

router
    .route('/profile')
    .put(
        validate(updateUserSchema),
        verifyToken,
        updateUser
    );

router
    .route('/:username')
    .get(
        validate(getUserSchema),
        verifyToken,
        getUser
    )
    .delete(
        validate(deleteUserSchema),
        verifyToken,
        deleteUser
    );

router
    .route('/:username/status')
    .patch(
        validate(updateStatusSchema),
        verifyToken, 
        updateStatus
    );


module.exports = router;