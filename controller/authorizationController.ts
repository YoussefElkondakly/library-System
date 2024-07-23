import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import { verify ,JwtPayload} from "jsonwebtoken";
import User from "../model/userModel";
import UserHandler from "../util/userHandler";
import { Request, Response, NextFunction,RequestHandler } from "express";
export const protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !(req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return next(new AppError("You are Not Logged in please log in", 400));
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token === "null")
    return next(new AppError("You are Not Logged In Please Login", 400));

  const payload = (await verify(token, process.env.JWT_SECURE!)) as JwtPayload;
  const id = payload.userId;
  const user = await User.findByPk(id, {
    attributes: [
      "id",
      "name",
      "phone",
      "role",
      "verified",
      "createdAt",
      "updatedAt",
      "passwordChangedAt",
    ],
  });
  if (!user) return next(new AppError("No User", 404));

  if (!user) return next(new AppError("User not found", 400));
  console.log(user.passwordChangedAt);
  const userHandler = new UserHandler();
  userHandler.user = user;
  if (userHandler.checkChangedPassword(payload.iat!, user.passwordChangedAt))
    return next(
      new AppError(
        "It seemed That You changed The Password After logging in please login again",
        404
      )
    );
  req.user = user;
  next();
});

export const accessManager = function (role: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    console.log(req.user)
    if (!(req.user.role === role))
      return next(
        new AppError("You are not allowed to access this route", 400)
      );
    next();
  };
};
export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified)
    return next(
      new AppError("You Cant make any Ad unless Your account Be Verified", 401)
    );
  next();
};