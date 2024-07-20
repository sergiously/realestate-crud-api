import {
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import sequelize from '../';
import Post from './post.model';
import { CurrencyCode } from '../../types/miscs.types';


/**
 * Interface representing the real estate post listing price history
 */
interface PriceListingAttributes {
  id: number;
  price?: number;
  currency?: CurrencyCode;
  postId: number;
  createdAt?: Date;
};

export interface PriceListingInput extends Optional<PriceListingAttributes, 'id'> {};
export interface PriceListingOutput extends Required<PriceListingAttributes> {};


/**
 * Represents a real estate post listing price history
 */
class PriceListing extends Model<PriceListingAttributes, PriceListingInput> implements PriceListingAttributes {
  public id!: number;
  public price!: number;
  public currency!: CurrencyCode;
  public postId!: number;

  public readonly createdAt!: Date;
};


/**
 * Initializes sequelize model for real estate post listings price history
 */
PriceListing.init({
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  postId: {
    field: 'post_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'id',
    }
  },
},
{
  sequelize,
  tableName: 'price_listing_history',
  createdAt: 'created_at',
  updatedAt: false,
});

Post.hasMany(PriceListing, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});
PriceListing.belongsTo(Post, {
  foreignKey: 'post_id',
  allowNull: false,
});

/*
 *  Workaround for autoincremental SERIAL type columns in PostgreSQL when using Sequelize
 *  and feeding the database from another source
 *  https://github.com/sequelize/sequelize/issues/9295
 */
sequelize.query("SELECT SETVAL('price_listing_history_id_seq', (SELECT MAX(id) from price_listing_history), true);");


export default PriceListing;
