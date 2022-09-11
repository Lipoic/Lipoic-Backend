import { Schema } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  verified_email: boolean;
  password_hash?: string;
  connects: ConnectAccount[];
  modes: UserMode[];
  login_ips: string[];
}

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

export enum UserMode {
  Student,
  Teacher,
  Parents,
}

export const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  verified_email: { type: Boolean, required: true },
  password_hash: { type: String, required: false },
    connects: {
        type: [{
      
  }], required: true },
  modes: { type: [String], required: true },
  login_ips: { type: [String], required: true },
});
