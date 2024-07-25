// @ts-nocheck
import { mocked } from 'jest-mock';
import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../../app/constants/errors.constants';
import {
  searchPosts,
  getPost,
  createNewPost,
  updatePost,
  softDeletePost,
} from '../../app/controllers/realEstatePost.controller';
import realEstateService from '../../app/services/realEstate.service';

/*
 *  Mocks
 */
jest.mock('../../app/services/realEstate.service');
const mockedRealEstateService = mocked(realEstateService);

describe('Real Estate Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('searchPosts', () => {
    it('should call realEstate.searchPosts with valid query parameters', async () => {
      const searchPostsQueryParams = {
        titleLike: 'testTitle',
        addressLike: 'testAddress',
        minSquareMeters: 36,
        maxSquareMeters: 100,
        bedrooms: 4,
        bathrooms: 2,
        minLifeQualityIndex: 6.33,
        maxLifeQualityIndex: 10,
        hasPorch: false,
        poolType: 'none',
        barbequeArea: 'none',
        parkingSpace: 'none',
        minCreatedAt: '2024-02-14T00:00:03.000Z',
        maxCreatedAt: '2024-05-03T00:00:03.000Z',
      };
      req.query = searchPostsQueryParams;

      await searchPosts(req, res, next);

      expect(mockedRealEstateService.search).toHaveBeenCalledWith(req.query);
    });

    it('should return a 500 status code and error message if realEstate.searchPosts throws an error', async () => {
      const searchPostsQueryParams = {
        titleLike: 'testTitle',
        addressLike: 'testAddress',
        minSquareMeters: 36,
        maxSquareMeters: 100,
        bedrooms: 4,
        bathrooms: 2,
        minLifeQualityIndex: 6.33,
        maxLifeQualityIndex: 10,
        hasPorch: false,
        poolType: 'none',
        barbequeArea: 'none',
        parkingSpace: 'none',
        minCreatedAt: '2024-02-14T00:00:03.000Z',
        maxCreatedAt: '2024-05-03T00:00:03.000Z',
      };
      req.query = searchPostsQueryParams;

      const error = new Error('Dummy error');
      mockedRealEstateService.search.mockRejectedValueOnce(error);

      await searchPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });

    it('should return a 200 status code and an array of three results if successful', async () => {
      const mockResult = {
        results: [
          {
            id: 2,
            title: 'House in General Las Heras',
            address:
              'Neumi Buzzi 46, General Las Heras, Buenos Aires, Argentina',
            squareMeters: 240,
            bedrooms: 2,
            bathrooms: 1,
            lifeQualityIndex: 6.55,
            hasPorch: true,
            poolType: 'none',
            barbequeArea: 'none',
            parkingSpace: 'driveway',
            status: 'SOLD',
            price: 47000,
            currency: 'USD',
            created_at: '2024-02-15T16:29:03.000Z',
            updated_at: null,
          },
          {
            id: 1,
            title:
              'Recreational house in Plomer, Buenos Aires (village located along route 6)',
            address:
              'Los Alamos 300, Plomer, General Las Heras, Buenos Aires, Argentina',
            squareMeters: 1600,
            bedrooms: 3,
            bathrooms: 1,
            lifeQualityIndex: 6.28,
            hasPorch: true,
            poolType: 'own',
            barbequeArea: 'none',
            parkingSpace: 'driveway',
            status: 'ON_SALE',
            price: 100000,
            currency: 'USD',
            created_at: '2024-02-08T17:09:02.000Z',
            updated_at: null,
          },
          {
            id: 3,
            title: '2 dorm house on sale with pool + guest house in Villars',
            address:
              'España 400, Villars, General Las Heras, Buenos Aires, Argentina',
            squareMeters: 280,
            bedrooms: 4,
            bathrooms: 3,
            lifeQualityIndex: 6.3,
            hasPorch: true,
            poolType: 'own',
            barbequeArea: 'own',
            parkingSpace: 'driveway',
            status: 'ON_HOLD',
            price: 95000,
            currency: 'USD',
            created_at: '2024-01-05T22:27:20.000Z',
            updated_at: null,
          },
        ],
        total: 39,
      };

      mockedRealEstateService.search.mockResolvedValueOnce(mockResult);

      await searchPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return a 200 status code and an array of zero results if successful', async () => {
      const mockResult = {
        results: [],
        total: 0,
      };

      mockedRealEstateService.search.mockResolvedValueOnce(mockResult);

      await searchPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getPost', () => {
    it('should call realEstate.getPost with valid path parameter', async () => {
      const getPostPathParam = {
        id: 2,
      };
      req.params = getPostPathParam;

      await getPost(req, res, next);

      expect(mockedRealEstateService.get).toHaveBeenCalledWith(req.params.id);
    });

    it('should return a 500 status code and error message if realEstate.getPost throws an error', async () => {
      const getPostPathParam = {
        id: 2,
      };
      req.params = getPostPathParam;

      const error = new Error('Dummy error');
      mockedRealEstateService.get.mockRejectedValueOnce(error);

      await getPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });

    it('should return a 200 status code and a single real estate post result if response successful and a record has been found', async () => {
      const getPostPathParam = {
        id: 2,
      };
      req.params = getPostPathParam;

      const mockResult = {
        id: 2,
        title: 'House in General Las Heras',
        address: 'Neumi Buzzi 46, General Las Heras, Buenos Aires, Argentina',
        squareMeters: 240,
        bedrooms: 2,
        bathrooms: 1,
        lifeQualityIndex: 6.55,
        hasPorch: true,
        poolType: 'none',
        barbequeArea: 'none',
        parkingSpace: 'driveway',
        status: 'SOLD',
        price: 47000,
        currency: 'USD',
        created_at: '2024-02-15T16:29:03.000Z',
        updated_at: null,
        isActive: true,
      };

      mockedRealEstateService.get.mockResolvedValueOnce(mockResult);

      await getPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return a 204 status code is response successful but record was not found', async () => {
      const getPostPathParam = {
        id: 2,
      };
      req.params = getPostPathParam;

      const mockResult = null;

      mockedRealEstateService.search.mockResolvedValueOnce(mockResult);

      await getPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('createNewPost', () => {
    it('should call realEstate.createNewPost with valid request body and return a 201 status code if create successful', async () => {
      const createPostBody = {
        title:
          'House with pool and barbeque area - Las Heras, Buenos Aires countryside',
        address: 'Dorrego 1023, General Las Heras, Buenos Aires, Argentina',
        squareMeters: 100,
        bedrooms: 3,
        bathrooms: 1,
        lifeQualityIndex: 6.33,
        hasPorch: true,
        poolType: 'own',
        barbequeArea: 'own',
        parkingSpace: 'driveway',
        status: 'ON_SALE',
        currency: 'USD',
        price: 85000,
      };
      req.body = createPostBody;

      const mockResult = {
        id: 4,
        title:
          'House with pool and barbeque area - Las Heras, Buenos Aires countryside',
        address: 'Dorrego 1023, General Las Heras, Buenos Aires, Argentina',
        squareMeters: 100,
        bedrooms: 3,
        bathrooms: 1,
        lifeQualityIndex: 6.33,
        hasPorch: true,
        poolType: 'own',
        barbequeArea: 'own',
        parkingSpace: 'driveway',
        status: 'ON_SALE',
        price: 85000,
        currency: 'USD',
        updated_at: '2024-07-14T23:06:53.862Z',
        created_at: '2024-07-14T23:06:53.862Z',
        isActive: true,
      };
      mockedRealEstateService.create.mockResolvedValueOnce(mockResult);

      await createNewPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return a 422 status code and error message if realEstate.createNewPost fails', async () => {
      const createPostBody = {
        title:
          'House with pool and barbeque area - Las Heras, Buenos Aires countryside',
        address: 'Dorrego 1023, General Las Heras, Buenos Aires, Argentina',
        squareMeters: 100,
        bedrooms: 3,
        bathrooms: 1,
        lifeQualityIndex: 6.33,
        hasPorch: true,
        poolType: 'own',
        barbequeArea: 'own',
        parkingSpace: 'driveway',
        status: 'ON_SALE',
        currency: 'USD',
        price: 85000,
      };
      req.body = createPostBody;

      const mockResult = null;
      mockedRealEstateService.create.mockResolvedValueOnce(mockResult);

      await createNewPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Could not create post',
      });
    });

    it('should return a 500 status code and error message if realEstate.createNewPost throws an error', async () => {
      const createPostBody = {
        title:
          'House with pool and barbeque area - Las Heras, Buenos Aires countryside',
        address: 'Dorrego 1023, General Las Heras, Buenos Aires, Argentina',
        squareMeters: 100,
        bedrooms: 3,
        bathrooms: 1,
        lifeQualityIndex: 6.33,
        hasPorch: true,
        poolType: 'own',
        barbequeArea: 'own',
        parkingSpace: 'driveway',
        status: 'ON_SALE',
        currency: 'USD',
        price: 85000,
      };
      req.body = createPostBody;

      const error = new Error('Dummy error');
      mockedRealEstateService.create.mockRejectedValueOnce(error);

      await createNewPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });
  });

  describe('updatePost', () => {
    it('should call realEstate.updatePost with valid request body and path param, and return a 200 status code if update successful', async () => {
      const updatePostPathParams = {
        id: 2,
      };
      const updatePostBody = {
        squareMeters: 80,
        bedrooms: 4,
        lifeQualityIndex: 6.95,
        hasPorch: false,
        parkingSpace: 'garage',
        price: 80000,
      };
      req.params = updatePostPathParams;
      req.body = updatePostBody;

      const mockResult = true;
      mockedRealEstateService.update.mockResolvedValueOnce(mockResult);

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post updated successfully',
      });
    });

    it('should return a 422 status code and error message if realEstate.updatePost fails', async () => {
      const updatePostPathParams = {
        id: 2,
      };
      const updatePostBody = {
        squareMeters: 80,
        bedrooms: 4,
        lifeQualityIndex: 6.95,
        hasPorch: false,
        parkingSpace: 'garage',
        price: 80000,
      };
      req.params = updatePostPathParams;
      req.body = updatePostBody;

      const mockResult = false;
      mockedRealEstateService.update.mockResolvedValueOnce(mockResult);

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Could not update post',
      });
    });

    it('should return a 500 status code and error message if realEstate.updatePost throws an error', async () => {
      const updatePostPathParams = {
        id: 2,
      };
      const updatePostBody = {
        squareMeters: 80,
        bedrooms: 4,
        lifeQualityIndex: 6.95,
        hasPorch: false,
        parkingSpace: 'garage',
        price: 80000,
      };
      req.params = updatePostPathParams;
      req.body = updatePostBody;

      const error = new Error('Dummy error');
      mockedRealEstateService.update.mockRejectedValueOnce(error);

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });
  });

  describe('softDeletePost', () => {
    it('should call realEstate.softDeletePost with valid request path param, and return a 200 status code if soft delete successful', async () => {
      const softDeletePostPathParams = {
        id: 2,
      };
      req.params = softDeletePostPathParams;

      const mockResult = 1;
      mockedRealEstateService.softDelete.mockResolvedValueOnce(mockResult);

      await softDeletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post deleted successfully',
      });
    });

    it('should return a 422 status code and error message if realEstate.softDeletePost fails', async () => {
      const updatePostPathParams = {
        id: 2,
      };
      req.params = updatePostPathParams;

      const mockResult = 0;
      mockedRealEstateService.softDelete.mockResolvedValueOnce(mockResult);

      await softDeletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Could not delete post',
      });
    });

    it('should return a 500 status code and error message if realEstate.softDeletePost throws an error', async () => {
      const updatePostPathParams = {
        id: 2,
      };
      req.params = updatePostPathParams;

      const error = new Error('Dummy error');
      mockedRealEstateService.softDelete.mockRejectedValueOnce(error);

      await softDeletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      });
    });
  });
});
