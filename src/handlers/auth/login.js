const { client } = require('../../../redis');
const { tokenUtils, passwordUtils } = require('../../utils');
const _ = require('lodash');

const login = async (req, res) => {
    try {

        const {
            username,
            password
        } = req.body;

        // check first if there is a user with the said username
        const userData = await client.hGetAll(username);
        const parsedData = JSON.parse(JSON.stringify(userData));

        // return error if username not found
        if(_.isEmpty(parsedData)) {
            return res.status(404).json({
                error: {
                    message: `User with username ${username} does not exist`
                }
            });
        }

        // check if password is same as the password saved in the database
        const isCorrectPassword = await passwordUtils.compare(password, parsedData.password);

        // return error for incorrect password
        if(!isCorrectPassword) {
            return res.status(401).json({
                error: {
                    message: "Incorrect password"
                }
            })
        }
        
        // extract email, role for token generation, isActive to throw error if user account is deactivated
        const { email, role, status } = parsedData;

        // check if user account is deactivated
        if(status === 'inactive') {
            return res.status(403).json({
                error: {
                    message: 'User account is deactivated'
                }
            })
        }

        // generate token for authorization purposes, to be used for accessing other apis
        const token = tokenUtils.generateToken({
            username,
            email,
            role
        })

        return res.status(200).json({
            success: {
                token
            }
        })
    }
    catch (err) {
        throw err;
    }
}

module.exports = login;