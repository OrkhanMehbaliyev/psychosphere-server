import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/appError.js";
import jwt from "jsonwebtoken";

export const userAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) throw new UnauthorizedError("You are not authenticated");

  if (typeof authHeader === "string") {
    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedError("Unauthorized");

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) throw new UnauthorizedError("Unauthorized");

      if (!req.data) req.data = {};
      req.data.user = user;

      next();
    });
  } else {
    throw new UnauthorizedError("Invalid authorization header format");
  }
};
