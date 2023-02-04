import { createServer } from '@/util/server';
import { connectDatabase } from '@/database';
import { init } from '@/util/init';

/**
 * Main entry point.
 */
async function main() {
  init();
  const app = createServer();
  const port = process.env.PORT ?? 8080;

  app.listen(port, () => {
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
