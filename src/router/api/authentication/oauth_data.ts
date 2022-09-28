import { ConnectType } from '@/model/auth/connect_account';

export class OauthData {
  readonly accountType: ConnectType;
  readonly clientSecret: string;
  readonly clientId: string;
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

  public getAuthUrl(): string {
    const uriPrefix = encodeURI(this.#getAuthUriPrefix());
    const clientId = encodeURIComponent(this.clientId);
    const scope = encodeURIComponent(this.#getScope());
    const redirectUri = encodeURIComponent(this.redirectUri);

    return `${uriPrefix}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

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
}
