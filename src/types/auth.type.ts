import z from "zod";
import type {
  loginSchema,
  registerSchema,
} from "../validations/auth.validation.js";

export type RegisterUserReqType = z.infer<typeof registerSchema>;
export type LoginUserReqType = z.infer<typeof loginSchema>;

export interface IRegisterUserRes {
  _id: string;
  fullname: string;
  email: string;
}
export class RegisterUserRes implements IRegisterUserRes {
  _id: string;
  fullname: string;
  email: string;

  constructor(_id: string, fullName: string, email: string) {
    this._id = _id;
    this.fullname = fullName;
    this.email = email;
  }
}

export interface ILoginUserRes {
  token: string;
}
export class LoginUserRes implements ILoginUserRes {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

export class AuthTokenClaims {
  id: string;
  isAdmin: boolean;

  constructor(id: string, isAdmin: boolean) {
    this.id = id;
    this.isAdmin = isAdmin;
  }
}
