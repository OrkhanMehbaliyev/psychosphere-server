import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import validateSchema from "../utils/validate.js";
import authService from "../services/auth.serv.js";
import { LoginUserRes, RegisterUserRes } from "../types/auth.type.js";
import { BadRequestError } from "../utils/appError.js";

const registerUser = async (req: Request, res: Response) => {
  try {
    validateSchema(registerSchema, req.body);

    const user = await authService.registerUser(req.body);
    const responseBody = new RegisterUserRes(
      user._id,
      user.fullname,
      user.email
    );
    res.status(201).json(responseBody);
  } catch (err) {
    throw err;
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    validateSchema(loginSchema, req.body);

    const { accessToken, refreshToken } = await authService.loginUser(req.body);
    const responseBody = new LoginUserRes(accessToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(responseBody);
  } catch (err) {
    throw err;
  }
};

const renewAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new BadRequestError("No refresh token");

    const accessToken = await authService.renewAccessToken(refreshToken);
    const responseBody = new LoginUserRes(accessToken);

    res.status(200).json(responseBody);
  } catch (err) {
    throw err;
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    throw err;
  }
};

export default { registerUser, loginUser, renewAccessToken, logoutUser };
