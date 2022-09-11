import { createServer } from '@/util/server';

const app = createServer();
const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
