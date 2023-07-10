const { client } = require('../../../redis');
const _ = require('lodash');

const getUsers = async (req, res) => {

    try {
            
        // call verifytoken to confirm if token is valid before querying
        const { role } = req.decodedToken;
        const { role: queryRole, status } = req.query;

        // fetch all keys in db then loop through each keys to get their values
        const keys = await client.keys('*');
        const parsedKeys = JSON.parse(JSON.stringify(keys));

        // store the users data to an array
        let usersData = await Promise.all(parsedKeys.map(async username => {
            const userData = await client.hGetAll(username);
            const { first_name, last_name, email, status, role } = JSON.parse(JSON.stringify(userData));
            return {
                username,
                first_name,
                last_name,
                email,
                status,
                role
            }
        }));

        // if role is customer, do not include users with role = admin to returned data and only active customer can be viewed by customers
        if(role === 'customer') {
            usersData = usersData.filter(data => data.role === 'customer' && data.status === 'active');
        }

        // else, check if requests needs to be filtered by role and/or status; only admin users can use filters role and status
        else {
            if (queryRole || status) {
                usersData = usersData.filter(data => {
                  if (queryRole && data.role !== queryRole) {
                    return false;
                  }
                  if (status && data.status !== status) {
                    return false;
                  }
                  return true;
                });
            }
        }

        return res.status(200).json({
            success: {
                data: usersData
            }
        });

    }

    catch(err) {
        throw err
    }
}

module.exports = getUsers;