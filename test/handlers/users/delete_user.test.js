const { client } = require('../../../redis');
const _ = require('lodash');
const delete_user = require('../../../src/handlers/users/delete_user');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn(),
    del: jest.fn()
  }
}));

describe('delete_user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a user', async () => {
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
      first_name: 'fname',
      last_name: 'lname',
      email: 'sample123@gmail.com',
      role: 'customer',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);
    client.del.mockResolvedValue({});

    await delete_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(client.del).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith();
  });
  it('should return an error if the role from auth token is customer', async () => {
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

    await delete_user(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Only users with admin role can delete users.'
      }
    });
  });
  it('should return an error if the user to be deleted does not exist', async () => {
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

    await delete_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: `User with username sample_customer does not exist`
      }
  });
  });
  it('should return an error if attempting to delete a user with admin role', async () => {
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
      role: 'admin',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);

    await delete_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Cannot delete users with admin role'
      }
    });
  });
});