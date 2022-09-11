import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

export function createServer(): Express {
  dotenv.config();

  const app: Express = express();

  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Hello, World!',
    });
  });

  return app;
}
