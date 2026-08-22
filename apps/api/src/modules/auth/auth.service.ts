import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import type { AuthResult, SafeUser } from "./auth.types.js";
import type { LoginInput, SignupInput } from "./auth.validation.js";

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
}): SafeUser {
  return { id: user.id, name: user.name, email: user.email };
}

function signToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export async function signup(input: SignupInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError(409, ErrorCodes.CONFLICT, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  });

  return { user: toSafeUser(user), token: signToken(user.id) };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(
      401,
      ErrorCodes.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(
      401,
      ErrorCodes.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  return { user: toSafeUser(user), token: signToken(user.id) };
}

export async function getMe(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "User not found");
  }

  return toSafeUser(user);
}