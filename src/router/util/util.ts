import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { verifyJWTToken } from '@/util/jwt';
import { Request, Response } from 'express';

/**
 * Get The IP address from request.
 * @param req The request object from express.
 * @returns The IP address.
 */
export function getIp(req: Request): string {
  const proxyByCloudflare = process.env.CLOUDFLARE === 'true';

  if (proxyByCloudflare) {
    // #swagger.auto = false
    return (req.headers['cf-connecting-ip'] || req.ip) as string;
  } else {
    return req.ip;
  }
}

/**
 * Set `req.user` to the user document if the request is authenticated.
 * @param req The request object from express.
 * @param res The response object from express.
 */
export async function authMiddleware(req: Request, res: Response) {
  // #swagger.auto = false
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const tokenInfo = authHeader.split(' ');

    const tokenType = authHeader.split(' ')[0];
    const token = tokenInfo[1];

    if (tokenType === 'Bearer' && token) {
      const verifyUser = await verifyJWTToken(token);

      if (verifyUser) {
        req.user = verifyUser;
      } else {
        /* #swagger.responses[403] = {
          schema: {
            code: 4,
          },
        }; */

        sendResponse(
          res,
          { code: ResponseStatusCode.AUTH_ERROR },
          HttpStatusCode.UNAUTHORIZED
        );
      }
    } else {
      sendResponse(
        res,
        { code: ResponseStatusCode.AUTH_ERROR },
        HttpStatusCode.UNAUTHORIZED
      );
    }
  } else {
    /* #swagger.responses[401] = {
      schema: {
        code: 4,
      },
    }; */

    sendResponse(
      res,
      { code: ResponseStatusCode.AUTH_ERROR },
      HttpStatusCode.UNAUTHORIZED
    );
  }
}
