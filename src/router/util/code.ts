export enum ResponseStatusCode {
  SUCCESS,
  OAUTH_CODE_ERROR,
  OAUTH_GET_USER_INFO_ERROR,
  LOGIN_USER_NOT_FOUND_ERROR,
  LOGIN_PASSWORD_ERROR,
  SING_UP_EMAIL_ALREADY_REGISTERED,
  VERIFY_EMAIL_ERROR,
  AUTH_ERROR,
  NOT_FOUND,
}

enum ResponseStatusCodeMessage {
  SUCCESS = 'Success',
  OAUTH_CODE_ERROR = 'OAuth auth code error.',
  OAUTH_GET_USER_INFO_ERROR = 'OAuth get user info error.',
  LOGIN_USER_NOT_FOUND_ERROR = 'User not found error.',
  LOGIN_PASSWORD_ERROR = 'Input password error.',
  SING_UP_EMAIL_ALREADY_REGISTERED = 'This email is already registered.',
  VERIFY_EMAIL_ERROR = 'This code is invalid.',
  AUTH_ERROR = 'This token is invalid.',
  NOT_FOUND = 'Resource not found.',
}

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}

type ResponseStatusCodeKeys = keyof typeof ResponseStatusCode;

export const getResponseStatusCodeData = (code: ResponseStatusCode) => {
  return {
    message:
      ResponseStatusCodeMessage[
        <ResponseStatusCodeKeys>ResponseStatusCode[code]
      ],
    code,
  };
};
