const { client } = require('../../../redis');
const _ = require('lodash');
const { passwordUtils } = require('../../utils');

const register = async (req, res) => {

    try {

        const {
            username,
            first_name,
            last_name,
            password,
            email,
            role
        } = req.body

        // retrieve user data for username validation, username should be unique per user
        const userData = await client.hGetAll(username);
        const parsedData = JSON.parse(JSON.stringify(userData));

        // if there is data fetched, return error since this means username is already used
        if(!_.isEmpty(parsedData)) {
            return res.status(400).json({
                error: {
                    message: 'Username is already used'
                }
            })
        }

        // encrypt password for database insertion
        const encryptedPassword = await passwordUtils.encrypt(password);

        // insert data to database, set status to active for newly registered users
        await client.hSet(
            username,
            {
                first_name,
                last_name,
                password: encryptedPassword,
                email,
                status: 'active',
                role
            }
        )

        return res.status(200).json({
            success: {
                message: 'User successfully registered'
            }
        })
    }

    catch (err) {
        throw err
    }
}

module.exports = register;