import type { Request, Response, NextFunction } from 'express';
import type { SearchPostsQueryParams } from '../types/request.types';
import type Post from '../datasource/models/post.model';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../constants/errors.constants';
import realEstateService from '../services/realEstate.service';

/**
 * Gets a list of real estate postings with their details (filter, pagination and ordering based on search query params)
 *
 * @param req - Express request object, containing optional search query params
 * @param res - Express response object
 * @param next - Express next function
 */
const searchPosts = async (
  req: Request<{}, {}, {}, SearchPostsQueryParams | any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req;

    const realEstatePosts = await realEstateService.search(query);

    res.status(200).json(realEstatePosts);
  } catch (error) {
    console.error('There was an error at "searchPosts" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

/**
 * Gets a single real estate post listing by its ID
 *
 * @param req - Express request object, containing the real estate posting ID
 * @param res - Express response object
 * @param next - Express next function
 */
const getPost = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params } = req;

    const realEstatePost = await realEstateService.get(params.id);

    if (realEstatePost?.isActive === true) {
      res.status(200).json(realEstatePost);
    } else if (realEstatePost?.isActive === false) {
      console.warn(
        'Attempted to retrieve a deleted post from "getPost" controller',
      );
      res.status(204);
    } else {
      res.status(204);
    }
  } catch (error) {
    console.error('There was an error at "getPost" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

/**
 * Creates a new real estate post listing
 *
 * @param req - Express request object, containing the real estate post properties
 * @param res - Express response object
 * @param next - Express next function
 */
const createNewPost = async (
  req: Request<{}, {}, Post>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;

    const realEstatePost = await realEstateService.create(body);

    if (realEstatePost) {
      res.status(201).json(realEstatePost);
    } else {
      res.status(422).json({ message: 'Could not create post' });
    }
  } catch (error) {
    console.error('There was an error at "createNewPost" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

/**
 * Updates an existing real estate post listing
 *
 * @param req - Express request object, containing the real estate post listing ID to update, and the properties to update
 * @param res - Express response object
 * @param next - Express next function
 */
const updatePost = async (
  req: Request<{ id: number }, {}, Post>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params, body } = req;

    const isPostUpdated = await realEstateService.update(params.id, body);

    if (isPostUpdated) {
      res.status(200).json({ message: 'Post updated successfully' });
    } else {
      res.status(422).json({ message: 'Could not update post' });
    }
  } catch (error) {
    console.error('There was an error at "updatePost" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

/**
 * Soft deletes an existing real estate post listing
 *
 * @param req - Express request object, containing the real estate posting ID
 * @param res - Express response object
 * @param next - Express next function
 */
const softDeletePost = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params } = req;

    const isPostDeleted = await realEstateService.softDelete(params.id);

    if (isPostDeleted) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(422).json({ message: 'Could not delete post' });
    }
  } catch (error) {
    console.error('There was an error at "softDeletePost" controller!', error);
    res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

export { searchPosts, getPost, createNewPost, updatePost, softDeletePost };
