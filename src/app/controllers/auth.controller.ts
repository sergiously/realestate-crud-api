import type { Request, Response, NextFunction } from 'express';
import type { LoginRequestBody } from '../types/request.types';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../constants/errors.constants';
import authService from '../services/auth.service';

/**
 * Generates an access token based on a client ID and a client secret
 *
 * @param req - Express request object, containing the client ID and secret in the body
 * @param res - Express response object
 * @param next - Express next function
 */
const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;

    const token = await authService.login(body);

    if (token) {
      res.status(200).json(token);
    } else {
      res.status(403).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error('There was an error at "login" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

/**
 * Blacklists an access token
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    const isSuccessful = await authService.logout(
      authorizationHeader?.split(' ')?.pop(),
    );

    if (isSuccessful) {
      res.status(200).json({ message: 'Token invalidated successfully' });
    } else {
      res.status(422).json({ message: 'Could not invalidate token' });
    }
  } catch (error) {
    console.error('There was an error at "logout" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

export { login, logout };
