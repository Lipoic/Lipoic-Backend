import { createServer } from '@/util/server';
import Database, { connectDatabase } from '@/database';
import { init } from '@/util/init';

export let db: Database;

async function main() {
  init();
  const app = createServer();
  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  try {
    db = await connectDatabase();
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Failed to connect to database', error);
    return;
  }
}

main();

/* on error */
process
  .on('uncaughtException', console.error)
  .on('unhandledRejection', console.error);
