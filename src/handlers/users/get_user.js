const { client } = require('../../../redis');
const _ = require('lodash');

const getUser = async (req, res) => {
    
    try {

        const { username } = req.params;
        const { role } = req.decodedToken;

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

        // for customer role, they can only view other customer profiles with active status
        if(role === 'customer') {
            if(parsedData.role === 'admin' || parsedData.status === 'inactive') {
                return res.status(403).json({
                    error: {
                        message: 'The customer is not allowed to view the resource'
                    }
                })
            }
        } 

        // remove password field before returning response
        delete parsedData.password;

        return res.status(200).json({
            success: {
                data: { username, ...parsedData}
            }
        })
    }

    catch(err) {
        throw err
    }
}

module.exports = getUser;