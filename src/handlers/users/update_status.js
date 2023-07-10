const _ = require('lodash');
const { client } = require('../../../redis');

const updateStatus = async (req, res) => {
    
    try {
        const { role } = req.decodedToken;
        const { status } = req.body;
        const { username } = req.params;

        // check first if role === admin, because only admins should be allowed to change status of users
        if(role !== 'admin') {
          return res.status(401).json({
            error: {
              message: 'Only admins can change user status'
            }
          })
        }

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

        // check if user to be updated is customer role because admins can only change status of customer roles
        if(parsedData.role === 'admin') {
          return res.status(400).json({
            error: {
              message: 'Cannot change status of users with admin roles'
            }
          })
        }

        // update status
        await client.hSet(
            username,
            {
                status
            }
        )

        return res.status(204).json()
    }

    catch(err) {
        throw err;
    }
}

module.exports = updateStatus;