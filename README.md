# Lipoic-Backend

The backend for Lipoic, using [Express.js](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/).

## Development

### Getting Started

Requirements:
- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com/getting-started/install)

Install dependencies:
```shell
yarn install
```

Start server (dev):
```shell
yarn dev
```

Start server (product):
```shell
yarn start
```

Build:
```shell
yarn build
```

ESLint:
```shell
yarn lint
```

## Configuration

Create the `.env` file and add key-value pairs according to the table below.
You can find an example in [`.env.example`](.env.example).

| Key                 | Description                 | Default Value               |
|---------------------|-----------------------------|-----------------------------|
| `PORT`              | The server port.            | `8080`                      |
| `DATABASE_URL`      | The URL to the MongoDB database.    | `mongodb://localhost:27017` |
| `DATABASE_USERNAME` | The database auth username. |                             |
| `DATABASE_PASSWORD` | The database auth password. |                             |
