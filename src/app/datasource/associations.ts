import Post from './models/post.model';
import PostStatus from './models/postStatus.model';
import PriceListing from './models/priceListing.model';

/**
 * Models association definitions
 */
const associations = () => {
  Post.hasMany(PostStatus, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
  });
  PostStatus.belongsTo(Post);

  Post.hasMany(PriceListing, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
  });
  PriceListing.belongsTo(Post);
};

export default associations;
