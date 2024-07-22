import type {
  AmmenityProperty,
  ParkingSpaceType,
  PostStatusEnum,
  CurrencyCode,
} from './miscs.types';

type LoginRequestBody = {
  clientId: string;
  clientSecret: string;
};

type LoginRequestResponse = {
  accessToken: string;
  scopes: string[];
  expiresIn: number;
};

type SearchPostsFilterQueryParams = {
  titleLike: string;
  addressLike: string;
  minSquareMeters: number;
  maxSquareMeters: number;
  bedrooms: number;
  minBedrooms: number;
  bathrooms: number;
  minBathrooms: number;
  minLifeQualityIndex: number;
  maxLifeQualityIndex: number;
  hasPorch: boolean;
  poolType: AmmenityProperty;
  barbequeArea: AmmenityProperty;
  parkingSpace: ParkingSpaceType;
  minCreatedAt: Date;
  maxCreatedAt: Date;
  minUpdatedAt: Date;
  maxUpdatedAt: Date;
  status: PostStatusEnum;
  currency: CurrencyCode;
  minPrice: number;
  maxPrice: number;
};

interface SearchPostsQueryParams extends SearchPostsFilterQueryParams {
  orderBy: string;
  orderDirection: string;
  limit: number;
  offset: number;
}

export {
  LoginRequestBody,
  LoginRequestResponse,
  SearchPostsFilterQueryParams,
  SearchPostsQueryParams,
};
