import authRepo from "../repo/auth.repo.js";
import {
  AuthTokenClaims,
  type LoginUserReqType,
  type RegisterUserReqType,
} from "../types/auth.type.js";
import { BadRequestError } from "../utils/appError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (body: RegisterUserReqType) => {
  const user = await authRepo.getUserByEmail(body.email);
  if (user) throw new BadRequestError("User already exists");

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const newUser = await authRepo.createUser({
    ...body,
    password: hashedPassword,
  });
  return { _id: newUser.id, fullname: newUser.fullname, email: newUser.email };
};

const loginUser = async (body: LoginUserReqType) => {
  const user = await authRepo.getUserByEmail(body.email);
  if (!user) throw new BadRequestError("Wrong credentials");

  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) throw new BadRequestError("Wrong credentials");

  const accessToken = jwt.sign(
    { id: user._id as string, isAdmin: user.isAdmin as boolean },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id as string, isAdmin: user.isAdmin as boolean },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

const renewAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET as string
  ) as AuthTokenClaims;

  const userId = decoded.id;
  const user = await authRepo.getUserById(userId);
  if (!user) throw new BadRequestError("Wrong credentials");

  const newAccessToken = jwt.sign(
    { id: user._id as string, isAdmin: user.isAdmin as boolean },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "5m",
    }
  );

  return newAccessToken;
};

export default { registerUser, loginUser, renewAccessToken };
