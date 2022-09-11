import { createServer } from '@/util/server';
import { connectDatabase } from '@/database';

async function main() {
  const app = createServer();
  const port = process.env.PORT ?? 8080;

  app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
  });

  try {
    const db = await connectDatabase();
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Failed to connect to database', error);
    return;
  }
}

main();
