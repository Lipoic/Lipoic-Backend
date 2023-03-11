import { compare, hash } from 'bcrypt';
import { User, UserDocument } from '@/model/auth/user';
import jwt from 'jsonwebtoken';

/**
 * Hash the password.
 * @param password The plain text password.
 * @returns The hash of the password.
 */
export async function passwordHash(password: string): Promise<string> {
  const saltRounds = 10;

  return await hash(password, saltRounds);
}

/**
 * Verify the password with the hash.
 * @param password The plain text password.
 * @param hash The hash of the password.
 * @returns True if the password is correct, false otherwise.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

/**
 * Create a code for verify the email.
 * @param id The user id.
 * @param email The user email.
 * @returns The verification code.
 */
export function createVerifyEmailCode(id: string, email: string): string {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Missing JWT private key');
  }

  const payload = {
    id: id.toString(),
    email,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '10 minutes',
  });
}

/**
 * Check if the code is valid.
 * @param code The verification code.
 * @returns The user document if the code is valid, null otherwise.
 */
export async function checkVerifyEmailCode(
  code: string
): Promise<UserDocument | null> {
  const publicKey = process.env.JWT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('Missing JWT public key');
  }

  try {
    const payload = jwt.verify(code, publicKey, {
      algorithms: ['ES256'],
    });

    if (typeof payload !== 'string') {
      const id = payload.id;
      const email = payload.email;

      if (typeof id === 'string' && typeof email === 'string') {
        const user = await User.findById(id);
        if (user && user.email === email) {
          return user;
        }
      }
    }
  } catch (e) {
    return null;
  }

  return null;
}
