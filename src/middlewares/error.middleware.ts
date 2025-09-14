import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: "PUBLIC_ERROR",
      },
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
