import express, { Express } from 'express';
import helmet from 'helmet';
import config from 'config';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './app/routes/auth.routes';
import realEstatePostRoutes from './app/routes/realEstatePost.routes';
import sequelize from './app/datasource';
import redis from './app/datasource/redis';
import { joiParseError } from './app/middleware/joi';
import { jwtHandler } from './app/middleware/jwt.middleware';
import swaggerDocument from '../swagger.json';

const app: Express = express();
const PORT = config.get('port') || 3000;

app.use(express.json());
app.use(helmet());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.use('/v1/auth', authRoutes);
app.use('/v1/real-estate-listing', jwtHandler, realEstatePostRoutes);
app.use(joiParseError);

console.info(`Starting database connections and API server on port ${PORT}...`);

app.listen(PORT, async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.info('Connected to database');

    await redis.connect();
    if (redis.isOpen) {
      console.info('Connected to redis instance');
    } else {
      console.error('Could not connect to redis instance');
      process.exit(1);
    }

    console.info(`Server running on port ${PORT}`);
  } catch (error) {
    console.error(error);
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
});
