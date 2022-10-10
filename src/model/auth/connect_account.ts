/**
 * The connect account of the user for save the third party OAuth info (e.g. google, facebook, etc.).
 */
export interface ConnectAccount {
  accountType: string;
  name: string;
  email: string;
}

/**
 * The connect account type.
 */
export enum ConnectType {
  Google,
  Facebook,
  // TaiwanCloudEducation,
}
