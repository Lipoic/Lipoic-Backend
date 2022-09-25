import { ConnectType } from '@/model/auth/connect_account';

export class OauthData {
  readonly account_type: ConnectType;
  readonly client_secret: string;
  readonly client_id: string;
  readonly redirect_uri: string;

  constructor(
    account_type: ConnectType,
    client_secret: string,
    client_id: string,
    redirect_uri: string
  ) {
    this.account_type = account_type;
    this.client_secret = client_secret;
    this.client_id = client_id;
    this.redirect_uri = redirect_uri;
  }

  public getAuthUrl(): string {
    const uriPrefix = encodeURI(this.#getAuthUriPrefix());
    const clientID = encodeURIComponent(this.client_id);
    const scope = encodeURIComponent(this.#getScope());
    const redirectUri = encodeURIComponent(this.redirect_uri);

    return `${uriPrefix}?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

  #getScope() {
    switch (this.account_type) {
      case ConnectType.Google:
        return 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      case ConnectType.Facebook:
        return 'public_profile,email';
    }
  }

  #getAuthUriPrefix() {
    switch (this.account_type) {
      case ConnectType.Google:
        return 'https://accounts.google.com/o/oauth2/auth';
      case ConnectType.Facebook:
        return 'https://www.facebook.com/dialog/oauth';
    }
  }
}
