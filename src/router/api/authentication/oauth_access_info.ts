import { ConnectType } from '@/model/auth/connect_account';
import axios from 'axios';

export class OauthAccessInfo {
  accessToken: string;
  expiresIn: number;
  tokenType: string;

  constructor(accessToken: string, expiresIn: number, tokenType: string) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.tokenType = tokenType;
  }

  async #getGoogleUserInfo(): Promise<GoogleUserInfo> {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    return response.data;
  }

  async #getFacebookUserInfo(): Promise<FacebookUserInfo> {
    const url = `https://graph.facebook.com/v14.0/me?fields=id,first_name,last_name,name,email,picture&access_token=${this.accessToken}`;
    const response = await axios.get(url);

    return response.data;
  }

  public async getAccountInfo(
    accountType: ConnectType
  ): Promise<OAuthAccountInfo> {
    switch (accountType) {
      case ConnectType.Google: {
        const info = await this.#getGoogleUserInfo();

        return {
          id: info.id,
          name: info.name,
          email: info.email,
          picture: info.picture,
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

export interface OAuthAccountInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
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

interface FacebookAccountPictureData {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}
