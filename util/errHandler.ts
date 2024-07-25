import express from "express";
import AppError from "./appError";

export const errHandler = (
  err: AppError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};
