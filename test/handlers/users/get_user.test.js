const { client } = require('../../../redis');
const _ = require('lodash');
const get_user = require('../../../src/handlers/users/get_user');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn()
  }
}));

describe('get_user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get a user', async () => {
    const req = {
      params: {
        username: 'sample_customer'
      },
      decodedToken: {
        role: 'admin'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_customer',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);

    await get_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
        data: {
          username: 'sample_customer',
          email: 'sample123@gmail.com',
          first_name: 'fname',
          last_name: 'lname',
          role: 'customer',
          status: 'active'
        }
      }
    });
  });
  it('should return an error if user does not exist', async () => {
    const req = {
      params: {
        username: 'sample_customer'
      },
      decodedToken: {
        role: 'admin'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {};

    client.hGetAll.mockResolvedValue(userData);

    await get_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: `User with username sample_customer does not exist`
      }
  });
  });
  it('should return an error if role is customer and tries to view user with admin role', async () => {
    const req = {
      params: {
        username: 'sample_customer'
      },
      decodedToken: {
        role: 'customer'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_customer',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'admin',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);

    await get_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: 'The customer is not allowed to view the resource'
      }
  });
  });
  it('should return an error if role is customer and tries to view user with inactive status', async () => {
    const req = {
      params: {
        username: 'sample_customer'
      },
      decodedToken: {
        role: 'customer'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_customer',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'inactive'
    };

    client.hGetAll.mockResolvedValue(userData);

    await get_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: 'The customer is not allowed to view the resource'
      }
  });
  });
});