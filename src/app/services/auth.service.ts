// @ts-nocheck
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import blackListedTokensRedisClient from '../datasource/redis';
import type {
  LoginRequestBody,
  LoginRequestResponse,
} from '../types/request.types';
import { SCOPES } from '../constants/auth.constants';

// Using hard-coded clientId's and Secrets for this example project
const mockUserDatabase = [
  {
    // admin user
    clientId: 'E4Uzsjr1DNYIT3k50bxB5jEfO56WzgWh',
    // plain text client secret: Yu2xFzldqavqCxOcfrzg4oud2LmrnL9FO9HOhlAWDBh1lV9kjUvtnquogX9EhcYe
    hashClientSecret:
      '$2y$10$3/2a70eshJFIptFC/fTjeO2k1/YjZx8NC4U3izn1mTkVgLYtnOG8a',
    scopes: [SCOPES.REALESTATE_READ, SCOPES.REALESTATE_WRITE],
  },
  {
    // read-only user
    clientId: 'sD5lnJ8Uz6dfdqFhxyVJc1pFnxBjGIDq',
    // plain text client secret: kFvZkcTui6icniNuRv1rNBFzUQ5VcmI1Jgy4Cz25bG9DC3xBNhSGakXWdMNlWNEG
    hashClientSecret:
      '$2y$10$lgcPzuriZi4EBj1DWf2oqOrHcF1pv3o9umVHp.7azxiUbkcygViJK',
    scopes: [SCOPES.REALESTATE_READ],
  },
];

/**
 * Generates an access token for a given user (client ID)
 *
 * @param loginRequest - client ID and client secret
 *
 * @returns in case of success, an object containing said access token, expiration time and scopes
 */
const login = async (
  loginRequest: LoginRequestBody,
): Promise<LoginRequestResponse | null> => {
  const client = mockUserDatabase.find(
    (record) => record.clientId === loginRequest.clientId,
  );
  if (!client) {
    console.warn('Attempted login with invalid clientId');
    return null;
  }
  const isValid = compare(loginRequest.clientSecret, client.hashClientSecret);
  if (!isValid) {
    console.warn('Attempted login with invalid clientSecret');
    return null;
  }

  const token = jwt.sign(
    {
      clientId: client.clientId,
      scopes: client.scopes,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_DEFAULT_EXPIRES_IN_MILISECONDS,
      subject: client.clientId,
      jwtid: `${Math.floor(Date.now())}`,
    },
  );

  return {
    accessToken: token,
    scopes: client.scopes,
    expiresIn: process.env.JWT_DEFAULT_EXPIRES_IN_MILISECONDS,
  };
};

/**
 * blacklists an access token
 *
 * @param accessToken - access token to blacklist
 *
 * @returns boolean true in case of successfuly blacklisting said token
 */
const logout = async (accessToken: string | any): Promise<boolean> => {
  const accessTokenPayload = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET,
  );

  const currentTime = Math.floor(Date.now() / 1000);
  const accessTokenLife = accessTokenPayload.exp - currentTime;

  await blackListedTokensRedisClient.setEx(
    accessToken,
    accessTokenLife,
    'true',
  );

  return true;
};

export default {
  login,
  logout,
};
