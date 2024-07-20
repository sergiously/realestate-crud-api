import type { SearchPostsQueryParams } from '../types/request.types';
import type Post from '../datasource/models/post.model';
import PostDal from '../datasource/dal/post.dal';


/**
 * Service for obtaining active real estate post listings from the datasource
 *
 * @param query - options filters, ordering, and limit criteria for obtaining results
 * 
 * @returns real estate post listings and the total number of real estate post listings matching query criteria
 */
const search = async (query: SearchPostsQueryParams): Promise<{ results: Post[], total: number }> => {
  const {
    limit,
    offset,
    orderBy,
    orderDirection,
    ...filters
  } = query;

  const posts = await PostDal.getAllActiveWithStatusAndPrice(filters, orderBy, orderDirection, limit, offset);

  return {
    results: posts.rows,
    total: posts.count,
  };
};

/**
 * Service for obtaining a single real estate post listing by its ID
 *
 * @param id - ID of the real estate post listing
 * 
 * @returns single real estate post listing, or null value in case of record not found
 */
const get = async (id: number): Promise<Post | null> => await PostDal.getByKey(id);

/**
 * Service for inserting a new real estate post listing into the datasource
 *
 * @param postRequest - real estate post listing to insert with its properties
 * 
 * @returns single real estate post listing just inserted, or null value in case of failing to insert
 */
const create = async (postRequest: Post): Promise<Post | null> => await PostDal.insertWithStatusHistoryAndPriceHistory(postRequest);

/**
 * Service for modifying an existing real estate post listing in the datasource
 *
 * @param id - ID of the real estate post listing to update
 * @param postRequest - real estate post listing to update with its properties
 * 
 * @returns boolean representing update success result
 */
const update = async (id: number, postRequest: Post): Promise<boolean> => await PostDal.updateWithStatusHistoryAndPriceHistory(id, postRequest);

/**
 * Service for soft deleting an existing real estate post
 *
 * @param id - ID of the real estate post listing to soft delete
 * 
 * @returns number representing the quantity of records updated. If 1, then the soft delete was successful
 */
const softDelete = async (id: number): Promise<number> => await PostDal.softDelete(id);


export default {
  search,
  get,
  create,
  update,
  softDelete,
};
