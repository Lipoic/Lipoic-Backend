import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';
import { OauthData } from '#/api/authentication/oauth_data';
import {
  OauthAccessInfo,
  OAuthAccountInfo,
} from '#/api/authentication/oauth_access_info';
import { User } from '@/model/auth/user';
import { UserLocale } from '@/model/auth/user_locale';

/**
 * Connect the OAuth account to the user.
 * @param oauth The OAuth data.
 * @param code The OAuth code.
 * @param ip The user IP address.
 * @returns The OAuth account information if the account is connected successfully, otherwise return null.
 */
export async function connectOAuthAccount(
  oauth: OauthData,
  code: string,
  ip: string,
  locale: UserLocale
): Promise<OAuthAccountInfo | null> {
  let accessInfo: OauthAccessInfo;

  try {
    accessInfo = await oauth.getAccessInfo(code);
  } catch (err) {
    return null;
  }

  const accountInfo = await accessInfo.getAccountInfo(oauth.accountType);
  const accountAlreadyExists = await User.exists({ email: accountInfo.email });

  // If the account doesn't exist, create a new user.
  if (!accountAlreadyExists) {
    const user = new User({
      username: accountInfo.name,
      email: accountInfo.email,
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: locale,
    });

    await user.save();
  }

  const accountType = ConnectType[oauth.accountType];
  const connectAccount: ConnectAccount = {
    accountType,
    name: accountInfo.name,
    email: accountInfo.email,
  };

  let isConnected = false;

  if (accountAlreadyExists) {
    const user = await User.findOne({ _id: accountAlreadyExists._id });

    if (user) {
      isConnected =
        user.connects.find(
          (c) => c.accountType === accountType && c.email === accountInfo.email
        ) !== undefined;
    }
  }

  // Add the login IP and connected account.
  await User.updateOne(
    {
      email: accountInfo.email,
    },
    {
      $addToSet: {
        loginIps: ip,
        connects: isConnected ? undefined : connectAccount,
      },
    }
  );

  return accountInfo;
}
