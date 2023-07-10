const _ = require('lodash');
const { passwordUtils } = require('../../utils');
const { client } = require('../../../redis');

const updatePassword = async (req, res) => {
    
    try {
        const { username } = req.decodedToken;
        const { current_password, new_password } = req.body;

        // check first if user exists
        const data = await client.hGetAll(username);
        const parsedData = JSON.parse(JSON.stringify(data));

        // if does not exist, return error
        if(_.isEmpty(parsedData)) {
            return res.status(404).json({
                error: {
                    message: `User with username ${username} does not exist`
                }
            });
        }

        // check if old password from body is the same as the user's current password on database
        const isCorrectPassword = await passwordUtils.compare(current_password, parsedData.password);

        if(!isCorrectPassword) {
            return res.status(400).json({
                error: {
                    message: 'Current password is incorrect'
                }
            })
        }

        // encrypt the input password
        const encryptedPassword = await passwordUtils.encrypt(new_password);

        // update password
        await client.hSet(
            username,
            {
                password: encryptedPassword
            }
        )

        return res.status(204).json()
    }

    catch(err) {
        throw err;
    }
}

module.exports = updatePassword;