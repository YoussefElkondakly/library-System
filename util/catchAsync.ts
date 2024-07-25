import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "./appError";

const catchAsync = function (fn: Function | RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch((err: AppError) => next(err));
};
export default catchAsync;
