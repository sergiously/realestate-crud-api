import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../';
import Post from './post.model';
import { PostStatusEnum } from '../../types/miscs.types';

/**
 * Interface representing the real estate post listing status history attributes
 */
interface PostStatusAttributes {
  id: number;
  status: PostStatusEnum;
  postId: number;
  createdAt?: Date;
}

export interface PostStatusInput extends Optional<PostStatusAttributes, 'id'> {}
export interface PostStatusOutput extends Required<PostStatusAttributes> {}

/**
 * Represents a real estate post listing status history
 */
class PostStatus
  extends Model<PostStatusAttributes, PostStatusInput>
  implements PostStatusAttributes
{
  public id!: number;
  public status!: PostStatusEnum;
  public postId!: number;

  public readonly createdAt!: Date;
}

/**
 * Initializes sequelize model for real estate post listings status history
 */
PostStatus.init(
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      field: 'status',
      type: DataTypes.ENUM(...Object.values(PostStatusEnum)),
      allowNull: false,
    },
    postId: {
      field: 'post_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'post_status_history',
    createdAt: 'created_at',
    updatedAt: false,
  },
);

Post.hasMany(PostStatus, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});
PostStatus.belongsTo(Post, {
  foreignKey: 'post_id',
});

/*
 *  Workaround for autoincremental SERIAL type columns in PostgreSQL when using Sequelize
 *  and feeding the database from another source
 *  https://github.com/sequelize/sequelize/issues/9295
 */
sequelize.query(
  "SELECT SETVAL('post_status_history_id_seq', (SELECT MAX(id) from post_status_history), true);",
);

export default PostStatus;
