const { client } = require('../../../redis');
const { passwordUtils } = require('../../../src/utils');
const _ = require('lodash');
const update_password = require('../../../src/handlers/users/update_password');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn(),
    hSet: jest.fn()
  }
}));

jest.mock('../../../src/utils', () => ({
  passwordUtils: {
    encrypt: jest.fn(),
    compare: jest.fn()
  }
}));

describe('update_password', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a user password', async () => {
    const req = {
      decodedToken: {
        username: 'sample_customer'
      },
      body: {
        current_password: 'admin',
        new_password: 'admin2'
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

    const encryptedPassword = 'encrypted_password';

    client.hGetAll.mockResolvedValue(userData);
    client.hSet.mockResolvedValue({});
    passwordUtils.compare.mockResolvedValue(true);
    passwordUtils.encrypt.mockResolvedValue(encryptedPassword);

    await update_password(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(passwordUtils.compare).toHaveBeenCalledWith('admin', 'hashed_password');
    expect(passwordUtils.encrypt).toHaveBeenCalledWith('admin2');
    expect(client.hSet).toHaveBeenCalledWith('sample_customer', {
      password: encryptedPassword
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith();
  });
  it('should return an error if the user does not exist', async () => {
    const req = {
      decodedToken: {
        username: 'sample_customer'
      },
      body: {
        current_password: 'admin',
        new_password: 'admin2'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {};

    client.hGetAll.mockResolvedValue(userData);

    await update_password(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: `User with username sample_customer does not exist`
      }
  });
  });
  it('should return an error if current_password input is not the same as fetched current password', async () => {
    const req = {
      decodedToken: {
        username: 'sample_customer'
      },
      body: {
        current_password: 'admin',
        new_password: 'admin2'
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
    passwordUtils.compare.mockResolvedValue(false);
    await update_password(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(passwordUtils.compare).toHaveBeenCalledWith('admin', 'hashed_password');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: 'Current password is incorrect'
      }
  });
  });
});