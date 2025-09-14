import type { Response } from "express";

export interface ISuccessResult<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface IErrorResult {
  success: boolean;
  message: string;
  code: string;
}

export function successResult<T = any>(
  message: string,
  data: T
): ISuccessResult<T> {
  return {
    success: true,
    message: message,
    data: data,
  };
}

export function errorResult(message: string, code: string): IErrorResult {
  return {
    success: false,
    message: message,
    code: code,
  };
}

export const sendResult = (
  res: Response,
  statusCode: number,
  body: any
): void => {
  res.status(statusCode).json(body);
};
