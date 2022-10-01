import dotenv from 'dotenv';
import fs from 'fs';

export function init() {
  dotenv.config();
  findJWTKeys();
}

export function findJWTKeys() {
  findJWTPublicKey();
  findJWTPrivateKey();
}

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
