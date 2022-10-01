import { ResponseStatusCode } from './src/router/util/code';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Lipoic API',
    version: '1.0.0',
    description: 'This is a REST API for Lipoic',
  },
  servers: [
    {
      url: 'https://api.lipoic.org',
      description: 'Production server',
    },
    {
      url: 'http://localhost:8080',
      description: 'Internal server for testing',
    },
  ],
  tags: ['Main', 'Authentication'],
  components: {
    '@schemas': {
      APIResponse: {
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            $ref: '#/components/schemas/ResponseStatusCode',
          },
          data: {
            type: 'object',
            nullable: true,
          },
        },
      },
      ResponseStatusCode: {
        type: 'number',
        description: 'Response status code',
        enum: Object.values(ResponseStatusCode)
          .filter((value) => typeof value !== 'number')
          .map(
            (value) =>
              `${value} (${ResponseStatusCode[value as ResponseStatusCode]})`
          ),
      },
      AuthURL: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            type: 'string',
            example:
              'https://accounts.google.com/o/oauth2/auth?client_id=test&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Flogin&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code',
          },
        },
      },
      AccessToken: {
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/router/index.ts'];

swaggerAutogen({ openapi: '3.0.3' })(outputFile, endpointsFiles, doc);

console.log('Swagger output generated successfully!');