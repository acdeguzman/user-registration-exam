const register = require('./register_user');
const getUser = require('./get_user');
const getUsers = require('./get_users');
const updateUser = require('./update_user');
const updatePassword = require('./update_password');
const updateStatus = require('./update_status');
const deleteUser = require('./delete_user');

module.exports = {
    register,
    getUser,
    getUsers,
    updateUser,
    updatePassword,
    updateStatus,
    deleteUser
}