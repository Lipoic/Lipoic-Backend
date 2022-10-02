import { User, UserDocument } from '@/model/auth/user';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export function createJWTToken(id: Types.ObjectId): string {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Missing JWT private key');
  }

  const payload = {
    id: id.toString(),
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '7 days',
  });
}

export async function verifyJWTToken(
  token: string
): Promise<UserDocument | null> {
  const publicKey = process.env.JWT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('Missing JWT public key');
  }

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['ES256'],
    });

    if (typeof payload !== 'string') {
      const id = payload.id;

      if (typeof id === 'string') {
        const user = await User.findById(id);
        return user;
      }
    }
  } catch (e) {
    return null;
  }

  return null;
}
