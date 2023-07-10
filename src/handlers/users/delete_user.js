const { client } = require('../../../redis');
const _ = require('lodash');

const deleteUser = async (req, res) => {
    
    try {

        const { username } = req.params;
        const { role } = req.decodedToken;

        // check if role === admin, only admin can delete a customer account. and only customer account can be deleted for now
        if(role === 'customer') {
          return res.status(401).json({
            error: {
              message: 'Only users with admin role can delete users.'
            }
          })
        }

        // check if data with username exists in db
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

        // return error if user to be deleted has an admin role
        if(parsedData.role === 'admin') {
            return res.status(400).json({
              error: {
                message: 'Cannot delete users with admin role'
              }
            })
        } 

        // proceed to deletion
        await client.del(username);

        return res.status(204).json()
    }

    catch(err) {
        throw err
    }
}

module.exports = deleteUser;