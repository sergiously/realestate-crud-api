import { mocked } from 'jest-mock';
import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../../app/constants/errors.constants';
import { login, logout } from '../../app/controllers/auth.controller';
import authService from '../../app/services/auth.service';

/*
 *  Mocks
 */
jest.mock('../../app/services/auth.service');
const mockedAuthService = mocked(authService);

describe('Auth Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('should call authService.login with the correct parameters', async () => {
      const loginRequestBody = {
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      };
      req.body = loginRequestBody;

      await login(req, res, next);

      expect(mockedAuthService.login).toHaveBeenCalledWith(loginRequestBody);
    });

    it('should return a 500 status code and error message if authService.login throws an error', async () => {
      const loginRequestBody = {
        clientId: 'testClientId',
        clientSecret: 'testClientSecret',
      };
      req.body = loginRequestBody;

      const error = new Error('Dummy error');
      mockedAuthService.login.mockRejectedValueOnce(error);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });

    it('should return a 200 status code and a token if login succesful', async () => {
      const loginRequestBody = {
        clientId: 'testValidClientId',
        clientSecret: 'testValidClientSecret',
      };
      req.body = loginRequestBody;

      mockedAuthService.login.mockResolvedValueOnce({
        accessToken: 'EXAMPLE_JWT_SUCCESSFULLY_GENERATED_TOKEN',
        scopes: ['EXAMPLE_SCOPE'],
        expiresIn: 900000,
      });

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'EXAMPLE_JWT_SUCCESSFULLY_GENERATED_TOKEN',
        scopes: ['EXAMPLE_SCOPE'],
        expiresIn: 900000,
      });
    });

    it('should return a 403 status code if login unsuccessful (invalid credentials)', async () => {
      const loginRequestBody = {
        clientId: 'testWrongClientId',
        clientSecret: 'testWrongClientSecret',
      };
      req.body = loginRequestBody;

      await mockedAuthService.login.mockResolvedValueOnce(null);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      req.headers = { authorization: 'Bearer EXAMPLE_VALID_TOKEN' };

      await logout(req, res, next);

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should return a 500 status code and error message if authService.logout throws an error', async () => {
      req.headers = { authorization: 'Bearer EXAMPLE_VALID_TOKEN' };

      const error = new Error('Dummy error');
      mockedAuthService.logout.mockRejectedValueOnce(error);

      await logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });

    it('should return a 200 status code and a message if logout successful', async () => {
      req.headers = { authorization: 'Bearer EXAMPLE_VALID_TOKEN' };

      await mockedAuthService.logout.mockResolvedValueOnce(true);

      await logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token invalidated successfully',
      });
    });
  });
});
