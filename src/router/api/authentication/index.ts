import { ConnectType } from '@/model/auth/connect_account';
import { OauthData } from '#/api/authentication/oauth_data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { Router } from 'express';

const router = Router();

router.get('/google/url', (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Get google oauth url'

  const redirectUri = req.query.redirect_uri;

  if (typeof redirectUri !== 'string') {
    /* #swagger.responses[400] = {
      schema: {
        code: 2,
      },
    }; */
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
    /* #swagger.responses[500] = {
      schema: {
        code: 2,
      },
    }; */
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

  /* #swagger.responses[200] = {
    schema: {
      code: 0,
      data: { $ref: '#/components/schemas/AuthURL' },
    },
  }; */
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { url: oauth.getAuthUrl() },
  });
});

router.get('/facebook/url', (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Get facebook oauth url'

  const redirectUri = req.query.redirect_uri;

  if (typeof redirectUri !== 'string') {
    /* #swagger.responses[400] = {
      schema: {
        code: 2,
      },
    }; */
    sendResponse(
      res,
      { code: ResponseStatusCode.GET_AUTH_URL_ERROR },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const clientSecret = process.env.FACEBOOK_OAUTH_SECRET;
  const clientId = process.env.FACEBOOK_OAUTH_ID;

  if (clientSecret === undefined || clientId === undefined) {
    /* #swagger.responses[500] = {
      schema: {
        code: 2,
      },
    }; */
    sendResponse(
      res,
      { code: ResponseStatusCode.GET_AUTH_URL_ERROR },
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
    return;
  }
  const oauth = new OauthData(
    ConnectType.Facebook,
    clientSecret,
    clientId,
    redirectUri
  );

  /* #swagger.responses[200] = {
    schema: {
      code: 0,
      data: { $ref: '#/components/schemas/AuthURL' },
    },
  }; */
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { url: oauth.getAuthUrl() },
  });
});

export { router as authenticationRouter };
