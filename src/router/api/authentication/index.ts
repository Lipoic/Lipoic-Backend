import { ConnectType } from '@/model/auth/connect_account';
import { OauthData } from '#/api/authentication/oauth_data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { Router } from 'express';

export const authenticationRouter = Router();

authenticationRouter.get('/google/url', (req, res) => {
  const redirectUri = req.query.redirect_uri;

  if (typeof redirectUri !== 'string') {
    sendResponse(
      res,
      { code: ResponseStatusCode.GET_AUTH_URL_ERROR },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const clientSecret = process.env.GOOGLE_OAUTH_SECRET;
  const clientId = process.env.GOOGLE_OAUTH_ID;

  if (clientSecret === undefined || clientId === undefined) {
    sendResponse(
      res,
      { code: ResponseStatusCode.GET_AUTH_URL_ERROR },
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
    return;
  }

  const oauth = new OauthData(
    ConnectType.Google,
    clientSecret,
    clientId,
    redirectUri
  );

  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { url: oauth.getAuthUrl() },
  });
});
