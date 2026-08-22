import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as authService from "./auth.service.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const signup = asyncHandler(async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const result = await authService.signup(parsed.data);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const result = await authService.login(parsed.data);
  res.status(200).json({ success: true, data: result });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user!.id);
  res.status(200).json({ success: true, data: user });
});