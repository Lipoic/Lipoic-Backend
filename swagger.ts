import { ResponseStatusCode } from './src/router/util/code';
import swaggerAutogen from 'swagger-autogen';
import { UserLocale } from './src/model/auth/user_locale';

const doc = {
  info: {
    title: 'Lipoic API Docs',
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
  tags: ['Main', 'Authentication', 'User'],
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
      User: {
        type: 'object',
        required: [
          'id',
          'username',
          'verifiedEmail',
          'modes',
          'locale',
          'createdAt',
          'updatedAt',
        ],
        properties: {
          id: {
            type: 'string',
            example: 'MongoDB ObjectId',
          },
          username: {
            type: 'string',
            example: 'John Doe',
          },
          verifiedEmail: {
            type: 'boolean',
            example: true,
          },
          modes: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/UserMode',
            },
            example: ['Teacher', 'Parent'],
          },
          locale: {
            ref: '#/components/schemas/UserLocale',
          },
          createdAt: {
            type: 'date',
            example: '2022-01-01T00:00:00.000Z',
          },
          updatedAt: {
            type: 'date',
            example: '2022-01-01T00:00:00.000Z',
          },
        },
      },
      UserMode: {
        type: 'string',
        description: 'User mode',
        enum: ['Student', 'Teacher', 'Parent'],
        example: 'Teacher',
      },
      EditUserInfoData: {
        type: 'object',
        description: 'The data for editing user info',
        properties: {
          username: {
            type: 'string',
            example: 'Lipoic',
          },
          modes: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/UserMode',
            },
            example: ['Students'],
          },
          locale: {
            $ref: '#/components/schemas/UserLocale',
          },
        },
      },
      UserLocale: {
        type: 'string',
        description: 'User locale',
        enum: Object.values(UserLocale),
        example: 'en-US',
      },
      SignUpUserData: {
        type: 'object',
        description: 'The data for signing up user',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'Lipoic',
          },
          email: {
            type: 'string',
            example: 'lipoic@lipoic.com',
          },
          password: {
            type: 'string',
            example: "I'm a password",
          },
          locale: {
            $ref: '#/components/schemas/UserLocale',
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
