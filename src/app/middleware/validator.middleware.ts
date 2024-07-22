import BaseJoi from 'joi';
import JoiDate from '@joi/date';
import { createValidator } from 'express-joi-validation';
import {
  MAX_SAFE_SMALLINT,
  MAX_SAFE_INTEGER,
  MAX_SAFE_PRICE,
  DEFAULT_MAX_DATABASE_LIMIT_QUERY,
  POSTS_FIELDS_ALLOWED_TO_ORDER,
} from '../constants/miscs.constants';
import {
  AmmenityProperty,
  ParkingSpaceType,
  PostStatusEnum,
  CurrencyCode,
} from '../types/miscs.types';

/**
 * Custom Joi middleware used for input validation in application's Express HTTP Requests
 */
const Joi = BaseJoi.extend(JoiDate).extend((joi) => ({
  base: joi.array(),
  type: 'stringArray',
  coerce: (value, helpers) => ({
    value: value.split ? value.split(',') : value,
  }),
}));

const validator = createValidator({
  passError: true,
});

const validateAuthBody = validator.body(
  Joi.object({
    clientId: Joi.string().min(1).max(255).required(),
    clientSecret: Joi.string().min(1).max(255).required(),
  }),
);

const validateSearchPosts = validator.query(
  Joi.object({
    titleLike: Joi.string().min(1).max(255).optional(),
    addressLike: Joi.string().min(1).max(255).optional(),
    minSquareMeters: Joi.number()
      .integer()
      .min(1)
      .max(MAX_SAFE_SMALLINT)
      .default(null)
      .when('maxSquareMeters', {
        not: null,
        then: Joi.number()
          .integer()
          .min(1)
          .less(Joi.ref('maxSquareMeters'))
          .default(1),
      }),
    maxSquareMeters: Joi.number()
      .integer()
      .min(1)
      .max(MAX_SAFE_SMALLINT)
      .default(null),
    bedrooms: Joi.number().integer().min(1).max(MAX_SAFE_SMALLINT).optional(),
    minBedrooms: Joi.number()
      .integer()
      .min(1)
      .max(MAX_SAFE_SMALLINT)
      .optional(),
    bathrooms: Joi.number().integer().min(1).max(MAX_SAFE_SMALLINT).optional(),
    minBathrooms: Joi.number()
      .integer()
      .min(1)
      .max(MAX_SAFE_SMALLINT)
      .optional(),
    minLifeQualityIndex: Joi.number()
      .precision(2)
      .min(0)
      .max(10.0)
      .default(null)
      .when('maxLifeQualityIndex', {
        not: null,
        then: Joi.number()
          .precision(2)
          .min(0)
          .less(Joi.ref('maxLifeQualityIndex'))
          .default(0),
      }),
    maxLifeQualityIndex: Joi.number()
      .precision(2)
      .min(0)
      .max(10.0)
      .default(null),
    hasPorch: Joi.boolean().optional(),
    poolType: Joi.stringArray()
      .items(Joi.string().valid(...Object.values(AmmenityProperty)))
      .single()
      .unique()
      .optional(),
    barbequeArea: Joi.stringArray()
      .items(Joi.string().valid(...Object.values(AmmenityProperty)))
      .single()
      .unique()
      .optional(),
    parkingSpace: Joi.stringArray()
      .items(Joi.string().valid(...Object.values(ParkingSpaceType)))
      .single()
      .unique()
      .optional(),
    minCreatedAt: Joi.date()
      .iso()
      .default(null)
      .when('maxCreatedAt', {
        not: null,
        then: Joi.date()
          .iso()
          .less(Joi.ref('maxCreatedAt'))
          .default('2000-01-01T00:00:00.000Z'),
      }),
    maxCreatedAt: Joi.date().iso().default(null),
    minUpdatedAt: Joi.date()
      .iso()
      .default(null)
      .when('maxUpdatedAt', {
        not: null,
        then: Joi.date()
          .iso()
          .less(Joi.ref('maxUpdatedAt'))
          .default('2000-01-01T00:00:00.000Z'),
      }),
    maxUpdatedAt: Joi.date().raw().default(null),
    status: Joi.stringArray()
      .items(Joi.string().valid(...Object.values(PostStatusEnum)))
      .single()
      .unique()
      .optional(),
    currency: Joi.stringArray()
      .items(Joi.string().valid(...Object.values(CurrencyCode)))
      .single()
      .unique()
      .optional(),
    minPrice: Joi.number()
      .precision(2)
      .min(0)
      .max(MAX_SAFE_PRICE)
      .default(null)
      .when('maxPrice', {
        not: null,
        then: Joi.number().precision(2).less(Joi.ref('maxPrice')).default(0),
      }),
    maxPrice: Joi.number()
      .precision(2)
      .min(0)
      .max(MAX_SAFE_PRICE)
      .default(null),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(DEFAULT_MAX_DATABASE_LIMIT_QUERY)
      .optional(),
    offset: Joi.number().integer().min(0).optional(),
    order_by: Joi.string()
      .valid(...POSTS_FIELDS_ALLOWED_TO_ORDER)
      .optional(),
    order_direction: Joi.string().valid('asc', 'desc').optional(),
  }),
);

const validatePostIdParam = validator.params(
  Joi.object({
    id: Joi.number().integer().min(1).max(MAX_SAFE_INTEGER).required(),
  }),
);

const validateCreateNewPost = validator.body(
  Joi.object({
    title: Joi.string().min(1).max(255).required(),
    address: Joi.string().min(1).max(255).required(),
    squareMeters: Joi.number()
      .integer()
      .min(1)
      .max(MAX_SAFE_SMALLINT)
      .required(),
    bedrooms: Joi.number().integer().min(1).max(MAX_SAFE_SMALLINT).required(),
    bathrooms: Joi.number().integer().min(1).max(MAX_SAFE_SMALLINT).required(),
    lifeQualityIndex: Joi.number().precision(2).min(0).max(10.0).optional(),
    hasPorch: Joi.boolean().required(),
    poolType: Joi.string()
      .valid(...Object.values(AmmenityProperty))
      .required(),
    barbequeArea: Joi.string()
      .valid(...Object.values(AmmenityProperty))
      .required(),
    parkingSpace: Joi.string()
      .valid(...Object.values(ParkingSpaceType))
      .required(),
    status: Joi.string()
      .valid(...Object.values(PostStatusEnum))
      .required(),
    currency: Joi.string()
      .valid(...Object.values(CurrencyCode))
      .required(),
    price: Joi.number().precision(2).min(0).max(MAX_SAFE_PRICE).required(),
  }),
);

const validateUpdatePost = validator.body(
  Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    address: Joi.string().min(1).max(255).optional(),
    squareMeters: Joi.number()
      .integer()
      .min(1)
      .max(MAX_SAFE_SMALLINT)
      .optional(),
    bedrooms: Joi.number().integer().min(1).max(MAX_SAFE_SMALLINT).optional(),
    bathrooms: Joi.number().integer().min(1).max(MAX_SAFE_SMALLINT).optional(),
    lifeQualityIndex: Joi.number().precision(2).min(0).max(10.0).optional(),
    hasPorch: Joi.boolean().optional(),
    poolType: Joi.string()
      .valid(...Object.values(AmmenityProperty))
      .optional(),
    barbequeArea: Joi.string()
      .valid(...Object.values(AmmenityProperty))
      .optional(),
    parkingSpace: Joi.string()
      .valid(...Object.values(ParkingSpaceType))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(PostStatusEnum))
      .optional(),
    currency: Joi.string()
      .valid(...Object.values(CurrencyCode))
      .optional(),
    price: Joi.number().precision(2).min(0).max(MAX_SAFE_PRICE).optional(),
  }),
);

export {
  validateAuthBody,
  validateSearchPosts,
  validatePostIdParam,
  validateCreateNewPost,
  validateUpdatePost,
};
