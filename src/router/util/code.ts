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

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}
