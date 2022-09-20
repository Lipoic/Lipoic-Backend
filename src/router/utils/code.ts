export class Code {
  constructor(public code: number, public message: string) {}

  static OK = new Code(200, 'OK');
  static NOT_FOUND = new Code(404, 'Resource not found.');
  // static oauth_code_error = new Code(1, 'OAuth auth code error.');
  // static oauth_get_user_info_error = new Code(
  //   2,
  //   'OAuth get user info error.'
  // );
  // static login_user_not_found_error = new Code(
  //   3,
  //   'User not found error.'
  // );
  // static login_password_error = new Code(4, 'Input password error.');
  // static sing_up_email_already_registered = new Code(
  //   5,
  //   'This email is already registered.'
  // );
  // static verify_email_error = new Code(6, 'This code is invalid.');
  // static auth_error = new Code(7, 'This token is invalid.');
}
