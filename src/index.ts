import { config } from 'dotenv';

import { createServer } from '@/util/server';

config();

/* on error */
process
  .on('uncaughtException', console.error)
  .on('unhandledRejection', console.error);

const { server } = createServer();

server.listen(process.env.PORT ?? 8080);
