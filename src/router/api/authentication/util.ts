import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';
import { OauthData } from '#/api/authentication/oauth_data';
import {
  OauthAccessInfo,
  OAuthAccountInfo,
} from '#/api/authentication/oauth_access_info';
import { User } from '@/model/auth/user';

/**
 * Connect the OAuth account to the user.
 * @param oauth The OAuth data.
 * @param code The OAuth code.
 * @param ip The user IP address.
 * @returns The OAuth account info if the account is connected successfully, otherwise return null.
 */
export async function connectOAuthAccount(
  oauth: OauthData,
  code: string,
  ip: string
): Promise<OAuthAccountInfo | null> {
  let accessInfo: OauthAccessInfo;

  try {
    accessInfo = await oauth.getAccessInfo(code);
  } catch (err) {
    return null;
  }

  const accountInfo = await accessInfo.getAccountInfo(oauth.accountType);
  const accountAlreadyExists = await User.exists({ email: accountInfo.email });

  if (!accountAlreadyExists) {
    const user = new User({
      username: accountInfo.name,
      email: accountInfo.email,
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: accountInfo.locale || 'zh-TW',
    });

    await user.save();
  }

  const connectAccount: ConnectAccount = {
    accountType: ConnectType[oauth.accountType],
    name: accountInfo.name,
    email: accountInfo.email,
  };

  // Add the login ip and connect account.
  await User.updateOne(
    {
      email: accountInfo.email,
    },
    {
      $addToSet: {
        loginIps: ip,
        connects: connectAccount,
      },
    }
  );

  return accountInfo;
}
