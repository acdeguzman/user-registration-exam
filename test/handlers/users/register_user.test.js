const { client } = require('../../../redis');
const { passwordUtils } = require('../../../src/utils');
const _ = require('lodash');
const register_user = require('../../../src/handlers/users/register_user');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn(),
    hSet: jest.fn()
  }
}));

jest.mock('../../../src/utils', () => ({
  passwordUtils: {
    encrypt: jest.fn()
  }
}))

describe('register_user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a user', async () => {
    const req = {
      body: {
        username: 'sample_customer',
        password: 'hashed_password',
        email: 'sample123@gmail.com',
        first_name: 'fname',
        last_name: 'lname',
        role: 'customer',
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {};
    const encryptedPassword = 'sample_encrypted_pw';

    client.hGetAll.mockResolvedValue(userData);
    passwordUtils.encrypt.mockResolvedValue(encryptedPassword);

    await register_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');
    expect(passwordUtils.encrypt).toHaveBeenCalledWith('hashed_password');
    expect(client.hSet).toHaveBeenCalledWith('sample_customer', {
      password: encryptedPassword,
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'active'
    })
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
        message: 'User successfully registered'
      }
    });
  });
  it('should return an error if username is already used', async () => {
    const req = {
      body: {
        username: 'sample_customer',
        password: 'hashed_password',
        email: 'sample123@gmail.com',
        first_name: 'fname',
        last_name: 'lname',
        role: 'customer',
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
    };

    client.hGetAll.mockResolvedValue(userData);

    await register_user(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
          message: 'Username is already used'
      }
  });
  });
  
});