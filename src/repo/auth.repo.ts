import userModel from "../models/user.model.js";
import type { RegisterUserReqType } from "../types/auth.type.js";

const getUserByEmail = async (email: string) => {
  const user = await userModel.findOne({ email });
  return user;
};

const getUserById = async (id: string) => {
  const user = await userModel.findById(id);
  return user;
};

const createUser = async (user: RegisterUserReqType) => {
  const newUser = await userModel.create(user);
  return newUser;
};

export default { getUserByEmail, createUser, getUserById };
