/**
 * The connected account of an user for save the third party OAuth info (e.g. Google, Facebook, etc.).
 */
export interface ConnectAccount {
  /**
   * The type of the connected account.
   * @see ConnectType
   */
  accountType: string;
  name: string;
  email: string;
}

/**
 * The connected account type.
 */
export enum ConnectType {
  Google,
  Facebook,
  // TaiwanCloudEducation,
}
