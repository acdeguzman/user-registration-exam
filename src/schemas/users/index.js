const registerUserSchema = require('./register_user_schema');
const getUserSchema = require('./get_user_schema');
const getUsersSchema = require('./get_users_schema');
const updateUserSchema = require('./update_user_schema');
const updatePasswordSchema = require('./update_password_schema');
const updateStatusSchema = require('./update_status_schema');
const deleteUserSchema = require('./delete_user_schema');

module.exports = {
    registerUserSchema,
    getUserSchema,
    getUsersSchema,
    updateUserSchema,
    updatePasswordSchema,
    updateStatusSchema,
    deleteUserSchema
}