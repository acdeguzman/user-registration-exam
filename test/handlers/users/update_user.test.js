const { client } = require('../../../redis');
const _ = require('lodash');
const update_user = require('../../../src/handlers/users/update_user');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn(),
    hSet: jest.fn()
  }
}));

describe('update_user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a user', async () => {
    const req = {
      decodedToken: {
        username: 'admin'
      },
      body: {
        first_name: 'admin_fname',
        last_name: 'admin_lname',
        email: 'adminemail@gmail.com'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'admin',
      password: 'hashed_password',
      first_name: 'fname',
      last_name: 'lname',
      email: 'sample123@gmail.com',
      role: 'customer',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);
    client.hSet.mockResolvedValue({});

    await update_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('admin');
    expect(client.hSet).toHaveBeenCalledWith('admin', {
      first_name: 'admin_fname',
      last_name: 'admin_lname',
      email: 'adminemail@gmail.com'
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith();
  });
  it('should return an error if user to be updated is not found', async () => {
    const req = {
      decodedToken: {
        username: 'admin'
      },
      body: {
        first_name: 'admin_fname',
        last_name: 'admin_lname',
        email: 'adminemail@gmail.com'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {};

    client.hGetAll.mockResolvedValue(userData);

    await update_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('admin');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
        error: {
          message: `User with username admin does not exist`
        }
      }
    );
  });
});