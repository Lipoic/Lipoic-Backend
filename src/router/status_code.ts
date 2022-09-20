export class StatusCode {
  constructor(public code: number, public message: string) {}

  static ok = new StatusCode(200, 'OK');
  // static not_found = new StatusCode(404, 'Resource not found.');
  // static OAUTH_CODE_ERROR = new StatusCode(1, 'OAuth auth code error.');
  // static OAUTH_GET_USER_INFO_ERROR = new StatusCode(
  //   2,
  //   'OAuth get user info error.'
  // );
  // static LOGIN_USER_NOT_FOUND_ERROR = new StatusCode(
  //   3,
  //   'User not found error.'
  // );
  // static LOGIN_PASSWORD_ERROR = new StatusCode(4, 'Input password error.');
  // static SIGN_UP_EMAIL_ALREADY_REGISTERED = new StatusCode(
  //   5,
  //   'This email is already registered.'
  // );
  // static VERIFY_EMAIL_ERROR = new StatusCode(6, 'This code is invalid.');
  // static AUTH_ERROR = new StatusCode(7, 'This token is invalid.');
}
