/**
 * Default params used by different fields of the database, including enums and max and min safe datatype limits
 */
const MAX_SAFE_SMALLINT = 32767;
const MAX_SAFE_INTEGER = 2147483647;
const MAX_SAFE_PRICE = 9999999999.99;
const DEFAULT_MAX_DATABASE_LIMIT_QUERY = 100;
const DEFAULT_DATABASE_ORDER_BY_FIELD = 'created_at';
const DEFAULT_DATABASE_ORDER_DIRECTION = 'desc';
const DEFAULT_DATABASE_LIMIT = 10;
const DEFAULT_DATABASE_OFFSET = 0;
const POSTS_FIELDS_ALLOWED_TO_ORDER = [
  'title',
  'address',
  'squareMeters',
  'bedrooms',
  'bathrooms',
  'lifeQualityIndex',
  'hasPorch',
  'price',
  'createdAt',
  'updatedAt',
];

export {
  MAX_SAFE_SMALLINT,
  MAX_SAFE_INTEGER,
  MAX_SAFE_PRICE,
  DEFAULT_MAX_DATABASE_LIMIT_QUERY,
  POSTS_FIELDS_ALLOWED_TO_ORDER,
  DEFAULT_DATABASE_ORDER_BY_FIELD,
  DEFAULT_DATABASE_ORDER_DIRECTION,
  DEFAULT_DATABASE_LIMIT,
  DEFAULT_DATABASE_OFFSET,
};
