import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../exceptions/appError";

export interface JwtPayload {
  id: string;
  event_id: string;
  name: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      participant?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Token não fornecido");
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    throw new UnauthorizedError("Formato de token inválido");
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    throw new UnauthorizedError("Token mal formatado");
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "default";
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.participant = decoded;

    return next();
  } catch (error) {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
};
