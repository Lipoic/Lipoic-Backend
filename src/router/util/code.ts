export enum StatusCode {
  OK = 200,
  NOT_FOUND = 404,
}

export enum StatusCodeMessage {
  OK = 'OK',
  NOT_FOUND = 'Resource not found.',
}

export enum Codes {
  OAUTH_CODE_ERROR = 1,
  OAUTH_GET_USER_INFO_ERROR = 2,
  LOGIN_USER_NOT_FOUND_ERROR = 3,
  LOGIN_PASSWORD_ERROR = 4,
  SING_UP_EMAIL_ALREADY_REGISTERED = 5,
  VERIFY_EMAIL_ERROR = 6,
  AUTH_ERROR = 7,
}

export enum CodeMessage {
  OAUTH_CODE_ERROR = 'OAuth auth code error.',
  OAUTH_GET_USER_INFO_ERROR = 'OAuth get user info error.',
  LOGIN_USER_NOT_FOUND_ERROR = 'User not found error.',
  LOGIN_PASSWORD_ERROR = 'Input password error.',
  SING_UP_EMAIL_ALREADY_REGISTERED = 'This email is already registered.',
  VERIFY_EMAIL_ERROR = 'This code is invalid.',
  AUTH_ERROR = 'This token is invalid.',
}

type StatusCodeKeys = keyof typeof StatusCode;
type CodeKeys = keyof typeof Codes;

export const getStatusCodeData = (code: StatusCode) => {
  return {
    message: StatusCodeMessage[<StatusCodeKeys>StatusCode[code]],
    code,
  };
};

export const getCodeData = (code: Codes) => {
  return {
    message: CodeMessage[<CodeKeys>Codes[code]],
    code,
  };
};
