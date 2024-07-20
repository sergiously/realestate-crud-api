import express from 'express';
import type {
  Request,
  Response,
  NextFunction
} from 'express';
import {
  searchPosts,
  getPost,
  createNewPost,
  updatePost,
  softDeletePost
} from '../controllers/realEstatePost.controller';
import {
  validateSearchPosts,
  validatePostIdParam,
  validateCreateNewPost,
  validateUpdatePost,
} from '../middleware/validator.middleware';

const router = express.Router();

router.get('/:id', validatePostIdParam, getPost);
router.patch('/:id', [validatePostIdParam, validateUpdatePost], updatePost);
router.delete('/:id', validatePostIdParam, softDeletePost);
router.get('/', validateSearchPosts, searchPosts);
router.post('/', validateCreateNewPost, createNewPost);

export default router;
