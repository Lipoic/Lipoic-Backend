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

| Key                     | Description                       | Default Value               |
|-------------------------|-----------------------------------|-----------------------------|
| `PORT`                  | The server port.                  | `8080`                      |
| `DATABASE_URL`          | The URL to the MongoDB database.  | `mongodb://localhost:27017` |
| `DATABASE_USERNAME`     | The database auth username.       |                             |
| `DATABASE_PASSWORD`     | The database auth password.       |                             |
| `ALLOWED_ORIGINS`       | The server allowed origins (CORS) |                             |
| `GOOGLE_OAUTH_SECRET`   | Google OAuth client secret        |                             |
| `GOOGLE_OAUTH_ID`       | Google OAuth client id            |                             |
| `FACEBOOK_OAUTH_SECRET` | Facebook OAuth client secret      |                             |
| `FACEBOOK_OAUTH_ID`     | Facebook OAuth client id          |                             |
| `CLOUDFLARE`            |The server is proxied by Cloudflare| `false`                     |
| `JWT_PRIVATE_KEY`       | The ECDSA privacy key used to sign the token|                         |
| `JWT_PUBLIC_KEY`        | The ECDSA public key used to verify the token|                        |

### Generate JWT keys
Generate keys for signing and verifying JWT tokens

```shell
openssl ecparam -genkey -name secp256k1 -noout -out jwt_private_key.pem
openssl ec -in jwt_private_key.pem -pubout -out jwt_public_key.pem
```

