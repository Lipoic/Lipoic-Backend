import express, { Express } from 'express';
import router from '@/router';
import morgan from 'morgan';

export function createServer(): Express {
  const app: Express = express();

  app.use(router);
  app.use(morgan('dev'));

  return app;
}
