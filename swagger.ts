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
      AuthURL: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            type: 'string',
          },
        },
        example: {
          url: 'https://accounts.google.com/o/oauth2/auth?client_id=test&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Flogin&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code',
        },
      },
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
        enum: [
          'SUCCESS (0)',
          'NOT_FOUND (1)',
          'GET_AUTH_URL_ERROR (2)',
          'OAUTH_CODE_CALLBACK_ERROR (3)',
        ],
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
