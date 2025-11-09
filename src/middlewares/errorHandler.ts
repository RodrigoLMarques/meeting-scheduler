import { NextFunction, Request, Response } from "express";
import { AppError } from "../exceptions/appError";

const getHttpErrorName = (statusCode: number): string => {
  const errorNames: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
  };
  return errorNames[statusCode] || "Error";
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: getHttpErrorName(error.statusCode),
    });
  }

  console.error(error.stack);

  return res.status(500).json({
    statusCode: 500,
    message: "Erro interno do servidor",
    error: "Internal Server Error",
  });
};
