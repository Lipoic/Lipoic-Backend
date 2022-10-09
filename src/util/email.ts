import { UserLocale } from '@/model/auth/user_locale';
import rootPath from 'app-root-path';
import fs from 'fs';
import { createTransport } from 'nodemailer';

/**
 * Send the verification email to the user.
 * @param username The username
 * @param toEmail The email address to send
 * @param code The verification code
 * @param locale The user locale
 */
export async function sendVerifyEmail(
  username: string,
  toEmail: string,
  code: string,
  locale: UserLocale
) {
  const clientURL = process.env.CLIENT_URL || 'https://lipoic.org';

  const emailFilePath = `${rootPath}/assets/verify_email/${locale}.html`;
  const emailHtml = fs
    .readFileSync(emailFilePath, { encoding: 'utf8' })
    .replaceAll('${clientURL}', clientURL)
    .replaceAll('${code}', code)
    .replaceAll('${username}', username);

  const subject: Record<UserLocale, string> = {
    'en-US': 'Verify your Lipoic account',
    'zh-CN': '验证您的 Lipoic 账户',
    'zh-TW': '驗證您的 Lipoic 帳號',
  };

  const host = process.env.VERIFY_EMAIL_HOST;
  const port = process.env.VERIFY_EMAIL_PORT;
  const user = process.env.VERIFY_EMAIL_USER;
  const password = process.env.VERIFY_EMAIL_PASSWORD;
  const from =
    process.env.VERIFY_EMAIL_FROM || 'Lipoic Account <contact@lipoic.org>';

  const transport = createTransport({
    host: host,
    port: port ? parseInt(port) : undefined,
    auth: {
      user,
      pass: password,
    },
  });

  await transport.sendMail({
    from: from,
    to: toEmail,
    subject: subject[locale],
    html: emailHtml,
  });
}
