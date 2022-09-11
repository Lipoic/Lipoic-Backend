export interface ConnectAccount {
  account_type: string;
  name: string;
  email: string;
}

export enum ConnectType {
  Google,
  Facebook,
  // TaiwanCloudEducation,
}
