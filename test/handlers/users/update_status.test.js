const { client } = require('../../../redis');
const _ = require('lodash');
const update_status = require('../../../src/handlers/users/update_status');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn(),
    hSet: jest.fn()
  }
}));

describe('update_status', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a user status', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      body: {
        status: 'inactive'
      },
      params: {
        username: 'sample_customer1'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      first_name: 'fname',
      last_name: 'lname',
      email: 'sample123@gmail.com',
      role: 'customer',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);
    client.hSet.mockResolvedValue({});

    await update_status(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(client.hSet).toHaveBeenCalledWith('sample_customer1', {
      status: 'inactive'
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith();
  });
  it('should return an error if a user with role customer tried to change user status', async () => {
    const req = {
      decodedToken: {
        role: 'customer'
      },
      body: {
        status: 'inactive'
      },
      params: {
        username: 'sample_customer1'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update_status(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Only admins can change user status'
      }
    });
  });
  it('should return an error if user to be updated does not exist', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      body: {
        status: 'inactive'
      },
      params: {
        username: 'sample_customer1'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {};

    client.hGetAll.mockResolvedValue(userData);

    await update_status(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: `User with username sample_customer1 does not exist`
      }
  });
  });
  it('should return an error if the user to be updated has an admin role', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      body: {
        status: 'inactive'
      },
      params: {
        username: 'sample_customer1'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      first_name: 'fname',
      last_name: 'lname',
      email: 'sample123@gmail.com',
      role: 'admin',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);

    await update_status(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Cannot change status of users with admin roles'
      }
    });
  });
});