import { createServer } from '@/util/server';
import { connectDatabase } from '@/database';
import { init } from '@/util/init';
import * as https from 'https';

/**
 * Main entry point.
 */
async function main() {
  init();
  const app = createServer();
  const port = process.env.PORT ?? 8080;

  const server = https.createServer(
    {
      key: process.env.CERT_KEY,
      cert: process.env.CERT,
    },
    app
  );
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  try {
    await connectDatabase();
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Failed to connect to database', error);
    return;
  }
}

main();

process
  .on('uncaughtException', console.error)
  .on('unhandledRejection', console.error);
