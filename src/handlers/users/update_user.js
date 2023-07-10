const _ = require('lodash');
const { client } = require('../../../redis');

const updateUser = async (req, res) => {
    
    try {
        const { username } = req.decodedToken;
        const { first_name, last_name, email } = req.body;

        // check first if user exists
        const data = await client.hGetAll(username);
        const parsedData = JSON.parse(JSON.stringify(data));

        // return error if no profile exists with the username from token
        if(_.isEmpty(parsedData)) {
            return res.status(404).json({
                error: {
                    message: `User with username ${username} does not exist`
                }
            });
        }

        // update user data
        await client.hSet(
            username,
            {
                first_name,
                last_name,
                email
            }
        )
        
        // just set status code to 204 no content since we don't need to return anything for successful update
        return res.status(204).json()
    }

    catch(err) {
        throw err;
    }
}

module.exports = updateUser;