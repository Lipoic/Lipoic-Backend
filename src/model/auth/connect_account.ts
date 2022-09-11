export interface ConnectAccount {
  account_type: ConnectType;
  name: string;
  email: string;
}

export enum ConnectType {
  Google,
  Facebook,
  // TaiwanCloudEducation,
}
