const { client } = require('../../../redis');
const _ = require('lodash');
const get_users = require('../../../src/handlers/users/get_users');

jest.mock('../../../redis', () => ({
  client: {
    keys: jest.fn(),
    hGetAll: jest.fn()
  }
}));

describe('get_users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get users', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      query: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const keysData = [
      'sample_customer1'
    ];

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'active'
    };

    client.keys.mockResolvedValue(keysData);
    client.hGetAll.mockResolvedValue(userData);

    await get_users(req, res);

    expect(client.keys).toHaveBeenCalledWith('*');
    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
          data: [{
            username: 'sample_customer1',
            email: 'sample123@gmail.com',
            role: 'customer',
            first_name: 'fname',
            last_name: 'lname',
            status: 'active'
          }]
      }
  });
  });
  it('should successfully get active customers for role = customer', async () => {
    const req = {
      decodedToken: {
        role: 'customer'
      },
      query: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const keysData = [
      'sample_customer1'
    ];

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'admin',
      status: 'active'
    };

    client.keys.mockResolvedValue(keysData);
    client.hGetAll.mockResolvedValue(userData);

    await get_users(req, res);

    expect(client.keys).toHaveBeenCalledWith('*');
    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
          data: []
      }
  });
  });
  it('should successfully get users with role = role indicated in input for admin requests', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      query: {
        role: "customer"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const keysData = [
      'sample_customer1'
    ];

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'admin',
      status: 'active'
    };

    client.keys.mockResolvedValue(keysData);
    client.hGetAll.mockResolvedValue(userData);

    await get_users(req, res);

    expect(client.keys).toHaveBeenCalledWith('*');
    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
          data: []
      }
  });
  });
  it('should successfully get users with status = status indicated in input for admin requests', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      query: {
        status: "active"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const keysData = [
      'sample_customer1'
    ];

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'admin',
      status: 'active'
    };

    client.keys.mockResolvedValue(keysData);
    client.hGetAll.mockResolvedValue(userData);

    await get_users(req, res);

    expect(client.keys).toHaveBeenCalledWith('*');
    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
          data: [
            {
              username: 'sample_customer1',
              email: 'sample123@gmail.com',
              first_name: 'fname',
              last_name: 'lname',
              role: 'admin',
              status: 'active'
            }
          ]
      }
  });
  });
  it('should successfully get users with status = status and role = role indicated in input for admin requests', async () => {
    const req = {
      decodedToken: {
        role: 'admin'
      },
      query: {
        status: "active",
        role: "customer"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const keysData = [
      'sample_customer1'
    ];

    const userData = {
      username: 'sample_customer1',
      password: 'hashed_password',
      email: 'sample123@gmail.com',
      first_name: 'fname',
      last_name: 'lname',
      role: 'customer',
      status: 'active'
    };

    client.keys.mockResolvedValue(keysData);
    client.hGetAll.mockResolvedValue(userData);

    await get_users(req, res);

    expect(client.keys).toHaveBeenCalledWith('*');
    expect(client.hGetAll).toHaveBeenCalledWith('sample_customer1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: {
          data: [
            {
              username: 'sample_customer1',
              email: 'sample123@gmail.com',
              first_name: 'fname',
              last_name: 'lname',
              role: 'customer',
              status: 'active'
            }
          ]
      }
  });
  });
});