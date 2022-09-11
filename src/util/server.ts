import express, { Express } from 'express';
import { createServer as httpServer, Server } from 'http';
import logger from 'morgan';
import cors from 'cors';

import router from '@/router';

export function createServer(): {
  app: Express;
  server: Server;
} {
  const app: Express = express();
  const server = httpServer(app);

  server
    .on('error', (err: { code?: string; syscall?: string }) => {
      if (err.syscall !== 'listen') throw err;

      switch (err.code) {
        case 'EACCES':
          console.error(`需要更高全縣`);
          break;
        case 'EADDRINUSE':
          console.error(`port 已使用\n正在更換 port`);
          break;
        default:
          throw err;
      }
    })
    .on('listening', async () => {
      const addr = server.address();
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;

      console.log(`is ready ${bind}`);
    });

  app
    .use(logger('dev'))
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(router);

  return { app, server };
}
