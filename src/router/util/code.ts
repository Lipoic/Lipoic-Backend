export class Code {
  constructor(public code: number, public message: string) {}

  static OK = new Code(200, 'OK');
  static NOT_FOUND = new Code(404, 'Resource not found.');
  // static OAUTH_CODE_ERROR = new Code(1, 'OAuth auth code error.');
  // static OAUTH_GET_USER_INFO_ERROR = new Code(
  //   2,
  //   'OAuth get user info error.'
  // );
  // static LOGIN_USER_NOT_FOUND_ERROR = new Code(
  //   3,
  //   'User not found error.'
  // );
  // static LOGIN_PASSWORD_ERROR = new Code(4, 'Input password error.');
  // static sing_up_email_already_registered = new Code(
  //   5,
  //   'This email is already registered.'
  // );
  // static verify_email_error = new Code(6, 'This code is invalid.');
  // static auth_error = new Code(7, 'This token is invalid.');
}
