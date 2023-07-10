const { client } = require('../../../redis');
const { tokenUtils, passwordUtils } = require('../../../src/utils');
const _ = require('lodash');
const login = require('../../../src/handlers/auth/login');

jest.mock('../../../redis', () => ({
  client: {
    hGetAll: jest.fn(),
  }
}));

jest.mock('../../../src/utils', () => ({
  tokenUtils: {
    generateToken: jest.fn()
  },
  passwordUtils: {
    compare: jest.fn()
  }
}));

describe('login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully log in and return a token', async () => {
    const req = {
      body: {
        username: 'sample_user',
        password: 'sample_password'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_user',
      password: 'hashed_password',
      first_name: 'fname',
      last_name: 'lname',
      email: 'sample123@gmail.com',
      role: 'customer',
      status: 'active'
    };

    const token = 'exampleToken';

    client.hGetAll.mockResolvedValue(userData);
    passwordUtils.compare.mockResolvedValue(true);
    tokenUtils.generateToken.mockReturnValue(token);

    await login(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_user');
    expect(passwordUtils.compare).toHaveBeenCalledWith('sample_password', 'hashed_password');
    expect(tokenUtils.generateToken).toHaveBeenCalledWith({
      username: 'sample_user',
      email: 'sample123@gmail.com',
      role: 'customer'
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
        token: 'exampleToken'
      }
    });
  });
  it('should return error if user logging in does not exist', async () => {
    const req = {
      body: {
        username: 'sample_user',
        password: 'sample_password'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {};

    client.hGetAll.mockResolvedValue(userData);

    await login(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_user');

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'User with username sample_user does not exist'
      }
    });
  });
  it('should return error for incorrect password', async () => {
    const req = {
      body: {
        username: 'sample_user',
        password: 'sample_password'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_user',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'active'
    };

    client.hGetAll.mockResolvedValue(userData);
    passwordUtils.compare.mockResolvedValue(false);

    await login(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_user');
    expect(passwordUtils.compare).toHaveBeenCalledWith('sample_password', 'hashed_password');

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Incorrect password'
      }
    });
  });
  it('should return error for loggin in using a deactivated account', async () => {
    const req = {
      body: {
        username: 'sample_user',
        password: 'sample_password'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const userData = {
      username: 'sample_user',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'inactive'
    };

    const token = 'exampleToken';

    client.hGetAll.mockResolvedValue(userData);
    passwordUtils.compare.mockResolvedValue(true);

    await login(req, res);

    expect(client.hGetAll).toHaveBeenCalledWith('sample_user');
    expect(passwordUtils.compare).toHaveBeenCalledWith('sample_password', 'hashed_password');

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'User account is deactivated'
      }
    });
  });
});
