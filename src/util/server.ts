import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from '#';
import swaggerDocument from 'swagger-output.json';
import swaggerUi from 'swagger-ui-express';

export function createServer(): Express {
  const app: Express = express();
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

  app
    .use(
      morgan('dev', {
        // Skip logging for api docs
        skip: (req) => req.originalUrl.startsWith('/api-docs'),
      })
    )
    .use(cors({ origin: allowedOrigins }))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(router);

  return app;
}
