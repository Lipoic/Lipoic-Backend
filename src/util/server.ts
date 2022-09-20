import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from '#';

export function createServer(): Express {
  const app: Express = express();
  const allowed_origins = process.env.ALLOWED_ORIGINS?.split(',');

  app
    .use(morgan('dev'))
    .use(cors({ origin: allowed_origins }))
    .use(express.json())
    .use(express.urlencoded({ extended: false }));

  app.use(router);

  return app;
}
