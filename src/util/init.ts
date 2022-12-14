import dotenv from 'dotenv';
import fs from 'fs';

/**
 * Initialize the environment variables.
 */
export function init() {
  dotenv.config();
  findJWTPublicKey();
  findJWTPrivateKey();
}

/**
 * Find the JWT public key for verify the JWT token.
 */
function findJWTPublicKey() {
  const alreadyExists = process.env.JWT_PUBLIC_KEY;

  if (!alreadyExists) {
    const path = './jwt_public_key.pem';
    const file = fs.existsSync(path);

    if (file) {
      process.env.JWT_PUBLIC_KEY = fs.readFileSync(path, 'utf8');
    }
  }
}

/**
 * Find the JWT private key for sign the JWT token.
 */
function findJWTPrivateKey() {
  const alreadyExists = process.env.JWT_PRIVATE_KEY;

  if (!alreadyExists) {
    const path = './jwt_private_key.pem';
    const file = fs.existsSync(path);

    if (file) {
      process.env.JWT_PRIVATE_KEY = fs.readFileSync(path, 'utf8');
    }
  }
}
