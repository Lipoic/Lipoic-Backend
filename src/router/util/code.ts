/**
 * The custom status code of the response.
 */
export enum ResponseStatusCode {
  SUCCESS,
  NOT_FOUND,
  GET_AUTH_URL_ERROR,
  OAUTH_CODE_CALLBACK_ERROR,
  AUTH_ERROR,
  USER_NOT_FOUND,
  UPDATE_USER_INFO_ERROR,
  Sign_Up_Email_Already_Used,
  Sign_Up_Error,
  Verify_Email_Error,
  Login_User_Error,
  Login_User_Email_Not_Verified,
  UNKNOWN_USER_AVATAR_FILE,
}

/**
 * The HTTP status code of the response.
 */
export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  CONFLICT = 409,
}
