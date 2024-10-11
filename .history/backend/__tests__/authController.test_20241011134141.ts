import { register } from '../src/controllers/authController';
import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../src/models/userModel';

jest.mock('../src/models/userModel'); // Mock user model functions

describe('authController - register', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json = jest.fn();
  let status = jest.fn(() => ({ json }));

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    res = {
      status,
      json
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user if not already registered', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(null);
    (createUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com'
    });

    await register(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: { id: 1, email: 'test@example.com' }
    });
  });

  it('should return 400 if user already exists', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com'
    });

    await register(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'User already exists' });
  });
});
