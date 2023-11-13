import mongoose from "mongoose";

export type UserType = {
  email: string;
  account: {
    username: string;
    avatar: object;
  };
  salt: string;
  token: string;
  hash: string;
};
export interface UserTypewithId extends UserType {
  _id: string;
}

const UserSchema = new mongoose.Schema<UserType>({
  email: { type: String, required: true },
  account: {
    username: { type: String, required: true },
    avatar: Object,
  },
  salt: { require: true, type: String },
  token: { require: true, type: String },
  hash: { require: true, type: String },
});

export const User = mongoose.model<UserType>("User", UserSchema);
