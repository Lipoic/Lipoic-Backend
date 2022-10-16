import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from '#';
import swaggerUi from 'swagger-ui-express';

/**
 * Create a new express server.
 * @returns The express server instance.
 */
export function createServer(): Express {
  const app: Express = express();
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

  app.use(
    morgan('dev', {
      // Skip logging for api documentation.
      skip: (req) => req.originalUrl.startsWith('/docs'),
    })
  );
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
    return res.send(
      swaggerUi.generateHTML(
        await import('swagger-output.json'),
        undefined,
        undefined,
        undefined,
        'https://github.com/Lipoic/Lipoic-Assets/raw/main/logo/logo.png',
        undefined,
        'Lipoic API Docs'
      )
    );
  });

  app.use(router);

  return app;
}
