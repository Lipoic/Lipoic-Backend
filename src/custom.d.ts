import { UserDocument } from '@/model/auth/user';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
