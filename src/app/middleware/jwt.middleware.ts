// @ts-nocheck
import jwt from 'jsonwebtoken';
import type {
  Request,
  Response,
  NextFunction
} from 'express';
import blackListedTokensRedisClient from '../datasource/redis';
import { ROUTES_TO_SCOPES_MAPPING } from '../constants/auth.constants';


/**
 * Custom JWT middleware for authentication and authorization in application's Express HTTP requests
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * @returns Express response object, formatted for custom error
 */
const jwtHandler = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')?.pop();

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const accessTokenPayload = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);

    const isTokenBlacklisted = await blackListedTokensRedisClient.exists(accessToken);
    if (isTokenBlacklisted === 1) {
      console.warn('Attempted access with an expired access token');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // console.debug('DEBUG - Route: ', req.method + ' ' + req.baseUrl + req.path;
    const reqMethodAndBaseUrl = `${req.method} ${req.baseUrl}${req.path}`;
    for (const [key, value] of Object.entries(ROUTES_TO_SCOPES_MAPPING)) {
      if (reqMethodAndBaseUrl.includes(key) && accessTokenPayload.scopes.includes(value)) {
        return next();
      }
    }

    console.warn('Attempted access to an unauthorized URL');
    return res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    console.warn('Could not verify token (possibly expired or invalid?)');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};


export {
  jwtHandler,
};
