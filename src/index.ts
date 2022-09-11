import { config } from 'dotenv';

import { createServer } from './util/server';
import { Database, connectDatabase } from './util/database';

config();

/* on error */
process
  .on('uncaughtException', console.error)
  .on('unhandledRejection', console.error);

async function start() {
  const { server } = createServer();

  server.listen(process.env.PORT ?? 8080);

  return await connectDatabase().catch((error) => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });
}

export let DB: Database;
start().then((database) => (DB = database));
