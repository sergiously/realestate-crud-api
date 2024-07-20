import express from 'express';
import {
  login,
  logout,
} from '../controllers/auth.controller';
import { validateAuthBody } from '../middleware/validator.middleware';

const router = express.Router();

/**
 * Application auth-related routes
 */
router.post('/login', validateAuthBody, login);
router.post('/logout', logout);

export default router;
