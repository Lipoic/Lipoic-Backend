import { UserDocument } from '@/model/auth/user';

declare global {
  namespace Express {
    export interface Request {
      /**
       * The user document of the authenticated request.
       * If the request is not authenticated, this will be null.
       *
       * Need to use {@link authMiddleware | the auth middleware} to set this value.
       */
      user?: UserDocument;
    }
  }
}
