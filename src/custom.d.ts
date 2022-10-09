import { UserDocument } from '@/model/auth/user';

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user of the request.
       * If the user is not authenticated, this will be null.
       * Need to use the `auth` middleware to set this value.
       */
      user?: UserDocument;
    }
  }
}
