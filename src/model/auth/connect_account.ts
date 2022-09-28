export interface ConnectAccount {
  accountType: string;
  name: string;
  email: string;
}

export enum ConnectType {
  Google,
  Facebook,
  // TaiwanCloudEducation,
}
