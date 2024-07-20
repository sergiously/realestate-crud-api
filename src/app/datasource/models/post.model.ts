import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import sequelize from '../index';
import {
  AmmenityProperty,
  ParkingSpaceType,
  PostStatusEnum,
  CurrencyCode,
} from '../../types/miscs.types';


/**
 * Interface representing the real estate post listing attributes
 */
interface PostAttributes {
  id: number;
  title: string;
  address: string;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  lifeQualityIndex?: number;
  hasPorch: boolean;
  poolType: AmmenityProperty;
  barbequeArea: AmmenityProperty;
  parkingSpace: ParkingSpaceType;
  isActive: boolean;
  status: PostStatusEnum;
  price: number;
  currency: CurrencyCode;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface PostInput extends Optional<PostAttributes, 'id'> {};
export interface PostOutput extends Required<PostAttributes> {};


/**
 * Represents a real estate post listing
 */
class Post extends Model<PostAttributes, PostInput> implements PostAttributes {
  public id!: number;
  public title!: string;
  public address!: string;
  public squareMeters!: number;
  public bedrooms!: number;
  public bathrooms!: number;
  public lifeQualityIndex!: number;
  public hasPorch!: boolean;
  public poolType!: AmmenityProperty;
  public barbequeArea!: AmmenityProperty;
  public parkingSpace!: ParkingSpaceType;
  public isActive!: boolean;
  public status!: PostStatusEnum;
  public price!: number;
  public currency!: CurrencyCode;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};


/**
 * Initializes sequelize model for real estate post listings
 */
Post.init({
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    field: 'title',
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  address: {
    field: 'address',
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  squareMeters: {
    field: 'square_meters',
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  bedrooms: {
    field: 'bedrooms',
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  bathrooms: {
    field: 'bathrooms',
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  lifeQualityIndex: {
    field: 'life_quality_index',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Based on https://icv.conicet.gov.ar/ data',
  },
  hasPorch: {
    field: 'has_porch',
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  poolType: {
    field: 'pool_type',
    type: DataTypes.ENUM(...Object.values(AmmenityProperty)),
    allowNull: false,
  },
  barbequeArea: {
    field: 'barbeque_area',
    type: DataTypes.ENUM(...Object.values(AmmenityProperty)),
    allowNull: false,
  },
  parkingSpace: {
    field: 'parking_space',
    type: DataTypes.ENUM(...Object.values(ParkingSpaceType)),
    allowNull: false,
  },
  isActive: {
    field: 'active',
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  status: {
    field: 'status',
    type: DataTypes.ENUM(...Object.values(PostStatusEnum)),
    allowNull: false,
  },
  price: {
    field: 'price',
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    field: 'currency',
    type: DataTypes.ENUM(...Object.values(CurrencyCode)),
    allowNull: false,
  },
},
{
  sequelize,
  tableName: 'post',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

/*
 *  Workaround for autoincremental SERIAL type columns in PostgreSQL when using Sequelize
 *  and feeding the database from another source
 *  https://github.com/sequelize/sequelize/issues/9295
 */
sequelize.query("SELECT SETVAL('post_id_seq', (SELECT MAX(id) from post), true);");


export default Post;
