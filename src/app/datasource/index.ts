import { Sequelize } from 'sequelize';

/*
 *  Workaround to return DECIMAL and float/double types as JS native number type
 *  (will deprecate in Sequelize v7)
 *  https://github.com/sequelize/sequelize/issues/11855
 */
(Sequelize as any).DataTypes.postgres.DECIMAL.parse = parseFloat;

/**
 * Creates and instantiates a connection to the Database where real estate post listings are stored
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export default sequelize;
