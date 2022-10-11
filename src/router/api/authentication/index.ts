import { isUserLocale } from '@/model/auth/user_locale';
import { ConnectType } from '@/model/auth/connect_account';
import { OauthData } from '#/api/authentication/oauth_data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { Router } from 'express';
import { connectOAuthAccount } from '#/api/authentication/util';
import { getIp } from '#/util/util';
import { User } from '@/model/auth/user';

const router = Router();

router.get('/google/url', (req, res) => {
  // #swagger.description = 'Get google oauth url'

  const redirectUri = req.query.redirectUri;

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

  if (!clientSecret || !clientId) {
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
  // #swagger.description = 'Get facebook oauth url'

  const redirectUri = req.query.redirectUri;

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

  if (!clientSecret || !clientId) {
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

router.get('/google/callback', async (req, res) => {
  // #swagger.description = 'Get access token by google oauth code'

  const code = req.query.code;
  const redirectUri = req.query.redirectUri;
  const locale = req.query.locale;

  if (
    typeof code !== 'string' ||
    typeof redirectUri !== 'string' ||
    !isUserLocale(locale)
  ) {
    /* #swagger.responses[400] = {
      schema: {
        code: 3,
      },
    }; */
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const clientSecret = process.env.GOOGLE_OAUTH_SECRET;
  const clientId = process.env.GOOGLE_OAUTH_ID;

  if (!clientSecret || !clientId) {
    /* #swagger.responses[500] = {
      schema: {
        code: 3,
      },
    }; */
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
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

  const accountInfo = await connectOAuthAccount(
    oauth,
    code,
    getIp(req),
    locale
  );

  if (!accountInfo) {
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const user = await User.findOne().where('email').equals(accountInfo.email);

  if (!user) {
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
    return;
  }

  const token = user.generateJWTToken();

  /* #swagger.responses[200] = {
    schema: {
      code: 0,
      data: { $ref: '#/components/schemas/AccessToken' },
    },
  }; */
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { token: token },
  });
});

router.get('/facebook/callback', async (req, res) => {
  // #swagger.description = 'Get access token by facebook oauth code'

  const code = req.query.code;
  const redirectUri = req.query.redirectUri;
  const locale = req.query.locale;

  if (
    typeof code !== 'string' ||
    typeof redirectUri !== 'string' ||
    !isUserLocale(locale)
  ) {
    /* #swagger.responses[400] = {
      schema: {
        code: 3,
      },
    }; */
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const clientSecret = process.env.FACEBOOK_OAUTH_SECRET;
  const clientId = process.env.FACEBOOK_OAUTH_ID;

  if (!clientSecret || !clientId) {
    /* #swagger.responses[500] = {
      schema: {
        code: 3,
      },
    }; */
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
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

  const accountInfo = await connectOAuthAccount(
    oauth,
    code,
    getIp(req),
    locale
  );

  if (!accountInfo) {
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const user = await User.findOne().where('email').equals(accountInfo.email);

  if (!user) {
    sendResponse(
      res,
      { code: ResponseStatusCode.OAUTH_CODE_CALLBACK_ERROR },
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
    return;
  }

  const token = user.generateJWTToken();

  /* #swagger.responses[200] = {
    schema: {
      code: 0,
      data: { $ref: '#/components/schemas/AccessToken' },
    },
  }; */
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { token: token },
  });
});

export { router as authenticationRouter };
