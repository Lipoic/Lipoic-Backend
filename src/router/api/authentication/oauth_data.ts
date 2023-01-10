import { OauthAccessInfo } from '#/api/authentication/oauth_access_info';
import { ConnectType } from '@/model/auth/connect_account';
import axios, { AxiosResponse } from 'axios';

export class OauthData {
  /**
   * The OAuth account type.
   */
  readonly accountType: ConnectType;

  /**
   * The client secret of the OAuth app.
   */
  readonly clientSecret: string;

  /**
   * The client ID of the OAuth app.
   */
  readonly clientId: string;

  /**
   * The redirect URI of the OAuth app.
   */
  readonly redirectUri: string;

  constructor(
    accountType: ConnectType,
    clientSecret: string,
    clientId: string,
    redirectUri: string
  ) {
    this.accountType = accountType;
    this.clientSecret = clientSecret;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  }

  /**
   * Get the OAuth authorization URI.
   * @returns The OAuth authorization URI.
   */
  public getAuthUrl(): string {
    const uriPrefix = encodeURI(this.#getAuthUriPrefix());
    const clientId = encodeURIComponent(this.clientId);
    const scope = encodeURIComponent(this.#getScope());
    const redirectUri = encodeURIComponent(this.redirectUri);

    return `${uriPrefix}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

  /**
   * Get the access information from OAuth service provider.
   * @param code The OAuth code.
   * @returns The access information.
   */
  public async getAccessInfo(code: string): Promise<OauthAccessInfo> {
    const data: Record<string, string> = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
    };

    const token_url = this.#getTokenUrl();
    let response: AxiosResponse;

    switch (this.accountType) {
      case ConnectType.Google:
        data['grant_type'] = 'authorization_code';
        response = await axios.postForm(token_url, data);
        break;
      case ConnectType.Facebook:
        response = await axios.get(token_url, { params: data });
        break;
    }

    const response_data = response.data;

    return new OauthAccessInfo(
      response_data.access_token,
      response_data.expires_in,
      response_data.token_type
    );
  }

  /**
   * Get the user information scope.
   * @returns The user information scope.
   */
  #getScope() {
    switch (this.accountType) {
      case ConnectType.Google:
        return 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      case ConnectType.Facebook:
        return 'public_profile,email';
    }
  }

  #getAuthUriPrefix() {
    switch (this.accountType) {
      case ConnectType.Google:
        return 'https://accounts.google.com/o/oauth2/auth';
      case ConnectType.Facebook:
        return 'https://www.facebook.com/dialog/oauth';
    }
  }

  #getTokenUrl() {
    switch (this.accountType) {
      case ConnectType.Google:
        return 'https://oauth2.googleapis.com/token';
      case ConnectType.Facebook:
        return 'https://graph.facebook.com/v14.0/oauth/access_token';
    }
  }
}
