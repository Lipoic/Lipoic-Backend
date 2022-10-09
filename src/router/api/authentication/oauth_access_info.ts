import { ConnectType } from '@/model/auth/connect_account';
import { UserLocale } from '@/model/auth/user_locale';
import axios from 'axios';

/**
 * The access info of the third party OAuth service provider
 */
export class OauthAccessInfo {
  /**
   * The access token
   */
  accessToken: string;
  /**
   * The access token expires time
   */
  expiresIn: number;
  /**
   * The access token type
   */
  tokenType: string;

  constructor(accessToken: string, expiresIn: number, tokenType: string) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.tokenType = tokenType;
  }

  /**
   * Get the user info from Google
   * @returns The google user info
   */
  async #getGoogleUserInfo(): Promise<GoogleUserInfo> {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    return response.data;
  }

  /**
   * Get the user info from Facebook
   * @returns The facebook user info
   */
  async #getFacebookUserInfo(): Promise<FacebookUserInfo> {
    const url = `https://graph.facebook.com/v14.0/me?fields=id,first_name,last_name,name,email,picture&access_token=${this.accessToken}`;
    const response = await axios.get(url);

    return response.data;
  }

  /**
   * Get the account info from OAuth service provider
   * @param accountType The OAuth account type
   * @returns The account info
   */
  public async getAccountInfo(
    accountType: ConnectType
  ): Promise<OAuthAccountInfo> {
    switch (accountType) {
      case ConnectType.Google: {
        const info = await this.#getGoogleUserInfo();
        const locales = Object.values(UserLocale).map((l) => l.toString());
        const locale = locales.includes(info.locale)
          ? (info.locale as UserLocale)
          : undefined;

        return {
          id: info.id,
          name: info.name,
          email: info.email,
          picture: info.picture,
          locale,
        };
      }
      case ConnectType.Facebook: {
        const info = await this.#getFacebookUserInfo();

        return {
          id: info.id,
          name: info.name,
          email: info.email,
          picture: info.picture.data.url,
        };
      }
    }
  }
}

/**
 * The account info of the third party OAuth service provider
 */
export interface OAuthAccountInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
  locale?: UserLocale;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface FacebookUserInfo {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  picture: FacebookAccountPicture;
}

interface FacebookAccountPicture {
  data: FacebookAccountPictureData;
}

/**
 * The data of the facebook account picture
 */
interface FacebookAccountPictureData {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}
