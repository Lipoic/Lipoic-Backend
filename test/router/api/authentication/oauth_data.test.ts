import { ConnectType } from '@/model/auth/connect_account';
import { OauthData } from '#/api/authentication/oauth_data';
import { expect, test } from 'vitest';

const clientId = 'The client id';
const clientSecret = 'The client secret';

test('Get auth URL with google account type', () => {
  const oauth = new OauthData(
    ConnectType.Google,
    clientSecret,
    clientId,
    'http://localhost:3000/login'
  );

  const authUrl = oauth.getAuthUrl();

  expect(authUrl).toBe(
    'https://accounts.google.com/o/oauth2/auth?client_id=The%20client%20id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code'
  );
});

test('Get auth URL with facebook account type', () => {
  const oauth = new OauthData(
    ConnectType.Facebook,
    clientSecret,
    clientId,
    'http://localhost:3000/login'
  );

  const authUrl = oauth.getAuthUrl();

  expect(authUrl).toBe(
    'https://www.facebook.com/dialog/oauth?client_id=The%20client%20id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=public_profile%2Cemail&response_type=code'
  );
});
