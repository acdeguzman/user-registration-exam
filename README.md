
# user-registration-exam

A simple Express.js app for user registration, authentication, and retrieval.

## Installation

Node version used during the development of this exercise is Node v18.16.0

1. Clone the project using `git clone` command
```bash
git clone https://github.com/acdeguzman/user-registration-exam.git
```
2. Navigate to project folder and run `npm install`
```bash
  cd user-registration-exam
  npm install
```
3. The in-memory database used for the exercise is ```redis```. You need to install redis locally to proceed with the testing. Redis can be downloaded from this website: https://redis.io/

4. After downloading and installing ```redis``` locally, run the ```redis-server``` command to start the redis server. It should be started first before trying the user registration application. On default, redis will run at port: ```6379```

5. To run the application, run the command ```npm run dev```
```bash
npm run dev
```

6. To run the unit test cases, run ```npm run test```
```bash
npm run test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`JWT_SECRET`

## API Reference

### User Login
- used to login to the app

```http
  POST /api/v1/auth/login/
```
#### Request Parameters

##### Request Body
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. User username. Minimum of 6 characters |
| `password` | `string` | **Required**. User password. Minimum of 6 characters |

#### Response Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Authorization token. Contains the user's email, username, and role |


### User Registration
- used to register to the app

```http
  POST /api/v1/users/
```
#### Request Parameters

##### Request Body
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. User's username. Minimum of 6 characters |
| `email` | `string` | **Required**. User's email |
| `password` | `string` | **Required**. User's password. Minimum of 6 characters |
| `first_name` | `string` | **Required**. User's first name. Minimum of 1 character |
| `last_name` | `string` | **Required**. User's last name. Minimum of 1 character |
| `role` | `string` | **Required**. User's role. Valid values are `customer` and `admin` |

#### Response Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `message` | `string` | **Required**. Success message indicating successful registration |

### Get All Users
- used to retrieve all users
```http
  GET /api/v1/users/
```
#### Request Parameters

##### Request Header
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Authorization token in the format `Bearer <token>` |

##### Request Query
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `role` | `string` |User role to be used as filter. Valid values are `admin` and `customer`. Only users with role `admin` can use this filter |
| `status` | `string` |User status to be used as filter. Valid values are `active` and `inactive`. Only users with role `admin` can use this filter |

#### Response Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. User's username |
| `first_name` | `string` | **Required**. User's first_name |
| `last_name` | `string` |**Required**.User's last name|
| `email` | `string` |**Required**. User's email|
| `status` | `string` |**Required**. User's status |
| `role` | `string` |**Required**. User's role |

### Get User
- used to retrieve a specific user
```http
  GET /api/v1/users/:username
```
#### Request Parameters

##### Request Header
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Authorization token in the format `Bearer <token>` |

##### Request Path Parameter
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username of the user to be searched. Minimum of 6 characters. User with customer roles are only allowed to view customers with `active` status |

#### Response Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. User's username |
| `first_name` | `string` | **Required**. User's first_name |
| `last_name` | `string` |**Required**.User's last name|
| `email` | `string` |**Required**. User's email|
| `status` | `string` |**Required**. User's status |
| `role` | `string` |**Required**. User's role |

### Delete User
- used to delete a specific user
```http
  DELETE /api/v1/users/:username
```
#### Request Parameters

##### Request Header
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Authorization token in the format `Bearer <token>` |

##### Request Path Parameter
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username of the user to be deleted. Only user with role `admin` are allowed to delete users. Users with `admin` roles cannot be deleted by any user. |

#### Response Parameters
The API will not return any content

### Update User Information
- used to update a user profile

```http
  PUT /api/v1/users/profile
```
#### Request Parameters

##### Request Body
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User's email |
| `first_name` | `string` | **Required**. User's first name. Minimum of 1 character |
| `last_name` | `string` | **Required**. User's last name. Minimum of 1 character |

#### Response Parameters
The API will not return any content

### Update User Password
- used to update user password for logging into the app
```http
  PATCH /api/v1/users/password
```
#### Request Parameters

##### Request Header
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Authorization token in the format `Bearer <token>` |

##### Request Body
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `current_password` | `string` | **Required**. User's current password. To be used for additional security |
| `new_password` | `string` | **Required**. New password to replace the current password |

#### Response Parameters
The API will not return any content

### Update User Status
- used to update user status
```http
  PATCH /api/v1/users/:username/status
```
#### Request Parameters

##### Request Header
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Authorization token in the format `Bearer <token>` |

##### Request Path Parameter
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username of the user to be deleted. Only user with role `admin` are allowed to update user status. Status of users with `admin` roles cannot be updated. |

##### Request Body
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `status` | `string` | **Required**. User's new status. Valid values are `active` and `inactive`. |

#### Response Parameters
The API will not return any content