import type { NextFunction, Request, Response } from "express";
import { AppError } from "../common/errors/AppError.js";
import { ErrorCodes } from "../common/errors/errorCodes.js";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    },
  });
}