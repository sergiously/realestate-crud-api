import { Op, Transaction } from 'sequelize';
import sequelize from '../index';
import {
  DEFAULT_DATABASE_ORDER_BY_FIELD,
  DEFAULT_DATABASE_ORDER_DIRECTION,
  DEFAULT_DATABASE_LIMIT,
  DEFAULT_DATABASE_OFFSET,
} from '../../constants/miscs.constants';
import type { SearchPostsFilterQueryParams } from '../../types/request.types';
import Post from '../models/post.model';
import PostStatus from '../models/postStatus.model';
import PriceListing from '../models/priceListing.model';

/**
 * Obtains active real estate post listings (with its current price and status) from the datasource
 *
 * @param filters - Optional fields to filter results
 * @param orderBy - Field used to order results
 * @param orderDirection - Order direction of results (possible values: 'asc' and 'desc')
 * @param limit - Number of max results to obtain
 * @param offset - Offset pagination of results to obtain
 *
 * @returns real estate post results, including the total number of results matching the filters
 */
const getAllActiveWithStatusAndPrice = async (
  filters?: SearchPostsFilterQueryParams,
  orderBy: string = DEFAULT_DATABASE_ORDER_BY_FIELD,
  orderDirection: string = DEFAULT_DATABASE_ORDER_DIRECTION,
  limit: number = DEFAULT_DATABASE_LIMIT,
  offset: number = DEFAULT_DATABASE_OFFSET,
): Promise<{ rows: Post[]; count: number }> =>
  await Post.findAndCountAll({
    attributes: { exclude: ['isActive'] },
    where: {
      isActive: true,
      ...(filters?.titleLike && {
        title: { [Op.like]: `%${filters.titleLike}%` },
      }),
      ...(filters?.addressLike && {
        address: { [Op.like]: `%${filters.addressLike}%` },
      }),
      ...(filters?.minSquareMeters && {
        squareMeters: { [Op.gte]: filters.minSquareMeters },
      }),
      ...(filters?.maxSquareMeters && {
        squareMeters: { [Op.lte]: filters.maxSquareMeters },
      }),
      ...(filters?.bedrooms && { bedrooms: filters.bedrooms }),
      ...(filters?.minBedrooms && {
        bedrooms: { [Op.gte]: filters.minBedrooms },
      }),
      ...(filters?.bathrooms && { bedrooms: filters.bathrooms }),
      ...(filters?.minBathrooms && {
        bedrooms: { [Op.gte]: filters.minBathrooms },
      }),
      ...(filters?.minLifeQualityIndex && {
        lifeQualityIndex: { [Op.gte]: filters.minLifeQualityIndex },
      }),
      ...(filters?.maxLifeQualityIndex && {
        lifeQualityIndex: { [Op.lte]: filters.maxLifeQualityIndex },
      }),
      ...(typeof filters?.hasPorch === 'boolean' && {
        hasPorch: filters.hasPorch,
      }),
      ...(filters?.poolType && { poolType: filters.poolType }),
      ...(filters?.barbequeArea && { barbequeArea: filters.barbequeArea }),
      ...(filters?.parkingSpace && { parkingSpace: filters.parkingSpace }),
      ...(filters?.minCreatedAt && {
        created_at: { [Op.gte]: filters.minCreatedAt },
      }),
      ...(filters?.maxCreatedAt && {
        created_at: { [Op.lte]: filters.maxCreatedAt },
      }),
      ...(filters?.minUpdatedAt && {
        updated_at: { [Op.gte]: filters.minUpdatedAt },
      }),
      ...(filters?.maxUpdatedAt && {
        updated_at: { [Op.lte]: filters.maxUpdatedAt },
      }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.currency && { currency: filters.currency }),
      ...(filters?.minPrice && { price: { [Op.gte]: filters.minPrice } }),
      ...(filters?.maxPrice && { price: { [Op.lte]: filters.maxPrice } }),
    },
    order: [[orderBy, orderDirection]],
    limit,
    offset,
  });

/**
 * Obtains a single active real estate post listing from the datasource by its ID
 *
 * @param id - datasource ID of the real estate post to get
 *
 * @returns single real estate post listing (or in case of no matching ID, a null value)
 */
const getByKey = async (id: number): Promise<Post | null> =>
  await Post.findByPk(id, {
    raw: true,
  });

/**
 * Inserts a new real estate post listing, including its price and status
 *
 * @param postRequest - properties and fields to insert in the new record
 *
 * @returns inserted real estate post listing
 */
const insertWithStatusHistoryAndPriceHistory = async (
  postRequest: Post,
): Promise<Post> =>
  await sequelize.transaction(async (transaction: Transaction) => {
    const post = await Post.create(postRequest, {
      transaction,
      fields: [
        'title',
        'address',
        'squareMeters',
        'bedrooms',
        'bathrooms',
        'lifeQualityIndex',
        'hasPorch',
        'poolType',
        'barbequeArea',
        'parkingSpace',
        'status',
        'price',
        'currency',
      ],
    });

    await PostStatus.create(
      {
        status: postRequest.status,
        postId: post.dataValues.id,
      },
      {
        transaction,
        fields: ['status', 'postId'],
      },
    );
    await PriceListing.create(
      {
        currency: postRequest.currency,
        price: postRequest.price,
        postId: post.dataValues.id,
      },
      {
        transaction,
        fields: ['currency', 'price', 'postId'],
      },
    );

    return post;
  });

/**
 * Modifies and existing real estate post listing, including its price and status
 *
 * @param id - datasource ID of the real estate post listing to update
 * @param postRequest - properties and fields to update in said real estate post listing
 *
 * @returns boolean representing record update success condition
 */
const updateWithStatusHistoryAndPriceHistory = async (
  id: number,
  postRequest: Post,
): Promise<boolean> =>
  await sequelize.transaction(async (transaction: Transaction) => {
    const updatedRows = await Post.update(postRequest, {
      transaction,
      where: {
        id,
      },
      fields: [
        'title',
        'address',
        'squareMeters',
        'bedrooms',
        'bathrooms',
        'lifeQualityIndex',
        'hasPorch',
        'poolType',
        'barbequeArea',
        'parkingSpace',
        'status',
        'price',
        'currency',
      ],
    });

    if (updatedRows[0]) {
      if (postRequest.status) {
        await PostStatus.create(
          {
            status: postRequest.status,
            postId: id,
          },
          {
            transaction,
            fields: ['status', 'postId'],
          },
        );
      }

      if (postRequest.price && postRequest.currency) {
        await PriceListing.create(
          {
            currency: postRequest.currency,
            price: postRequest.price,
            postId: id,
          },
          {
            transaction,
            fields: ['currency', 'price', 'postId'],
          },
        );
      }

      return true;
    }

    return false;
  });

/**
 * Marks a real estate post listing as inactive in the datasource
 *
 * @param id - datasource ID of the real estate post listing to soft delete
 *
 * @returns number representing the updated records. If 1, then the soft delete was successful
 */
const softDelete = async (id: number): Promise<number> => {
  const result = await Post.update(
    { isActive: false },
    {
      where: {
        id,
        isActive: true,
      },
    },
  );

  return result[0];
};

export default {
  getAllActiveWithStatusAndPrice,
  getByKey,
  insertWithStatusHistoryAndPriceHistory,
  updateWithStatusHistoryAndPriceHistory,
  softDelete,
};
