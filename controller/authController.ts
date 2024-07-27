import { hash } from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import User from "../model/userModel";
import catchAsync from "./../util/catchAsync";
import Crypto from "crypto";
import AppError from "../util/appError";
import { Op } from "sequelize";
import sendEmail from "./../util/mailSender";
import UserHandler from "../util/userHandler";
import Password from "../util/passwordRepo";

const createHashedToken = function (urlToken: string) {
  return Crypto.createHash("sha256").update(urlToken).digest("hex");
};
const createMailToken = async function (
  userHandler: UserHandler,
  request: Request,
  type: string
) {
  const verifycode = userHandler.createToken(type);

  await userHandler.save();

  const verifyURL = `${request.protocol}://${request.get(
    "host"
  )}/librarysystem/auth/${
    type === "reset" ? "resetPassword" : "verifyregistration"
  }/${verifycode}`;
  const message = `your ${
    type === "reset" ? "Password Reset" : "Account Verification"
  } Link is: ${verifyURL}`;
  try {
    await sendEmail({
      email: userHandler.user.email,
      subject: `Verify Account`,
      message,
    });
  } catch (err) {
    if (type === "reset") {
      userHandler.user.passwordResetToken = null;
      userHandler.user.passwordResetExpires = null;
    } else userHandler.user.verifyUserToken = null;
    await userHandler.save();
    return new AppError(
      "There was an error sending the verification email. Please try again later",
      500
    );
  }
};
const sendJsonResponseToken = function (
  userId: number,
  status: number,
  res: Response
) {
  const token = sign({ userId }, process.env.JWT_SECURE!, {
    expiresIn: process.env.JWT_DURATION,
  });

  res.status(status).json({
    status: "success",
    token,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  /*Here I can see the email and make some restrictions on it if it alraeady used many times*/
  if (!req.body.passwordConfirm) {
    return next(new AppError("You Need To Confirm Password", 403));
  } else if (req.body.passwordConfirm !== req.body.password) {
    return next(new AppError("Password Not Matched", 403));
  }

  if (!req.body.phone.includes("+2")) req.body.phone = "+2" + req.body.phone;
  const pass=new Password()
  pass.set(req.body.password)
  req.body.password = await pass.hashPassword();
  const newUser = await User.create(req.body);

  if (!newUser) return next(new AppError("problem", 404));
  console.log(newUser);
  const userHandler = new UserHandler();
  userHandler.user = newUser;
  //TODOFIXME uncomment
  if (req.body.role === "PATRON")
    await createMailToken(userHandler, req, "verify");

  sendJsonResponseToken(newUser.id, 201, res);
});
export const login = catchAsync(async (req, res, next) => {
  if (!req.body.password)
    return next(new AppError("Please Provide the password filed", 404));
  const userHandler = new UserHandler();
const pass=new Password()
  const checkPassword =await pass.comparePassword(req.body.password,req.user[0].password);
  if (!checkPassword)
    return next(new AppError("Incorrect Email Or Password", 404));
  sendJsonResponseToken(req.user[0].id, 201, res);
});

export const verifyRegistration = catchAsync(async (req, res, next) => {
  const receivedToken = req.params.verificationcode;
  const userToken = createHashedToken(receivedToken);
  const user = await User.findAll({
    where: {
      verifyUserToken: userToken,
    },
  });
  if (!user[0]) return next(new AppError("User not found ", 400));
  if (user[0].verified) return next(new AppError("User already verified", 400));
  user[0].verified = true;
  user[0].verifyUserToken = null;
  await user[0].save();

  res.status(200).json({
    status: "success",
    message: "user has Been Verified please login",
  });
});
export const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email)
    return next(new AppError("please Provide your Email Address", 400));
  const user = await User.findAll({ where: { email: req.body.email } });
  if (!user[0]) return next(new AppError("User not found", 404));
  const userHandler = new UserHandler();
  userHandler.user = user[0];
  await createMailToken(userHandler, req, "reset");

  res.status(201).json({
    status: "success",
    message: "Token sent to your email please check your email",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.passwordConfirm) {
    return next(new AppError("You Need To Confirm Password", 403));
  } else if (req.body.passwordConfirm !== req.body.password) {
    return next(new AppError("Password Not Matched", 403));
  }
  const receivedToken = req.params.code;
  const userToken = createHashedToken(receivedToken);
  console.log(userToken);
  const user = await User.findAll({
    where: {
      passwordResetToken: userToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });

  // console.log(user[0])
  if (!user[0].passwordResetExpires)
    return next(new AppError("Prop line 194", 404));
  if (!user[0]) return next(new AppError("User not found ", 404));
  if (!(new Date(user[0].passwordResetExpires).getTime() > Date.now()))
    return next(
      new AppError(
        "Password Reset Token Has Expired please send another request",
        400
      )
    ); //send error
  user[0].password = req.body.password;
  user[0].passwordResetToken = null;
  user[0].passwordResetExpires = null;
  user[0].passwordChangedAt = new Date(Date.now() - 1000);
  await user[0].save();

  res.status(201).json({
    status: "success",
    message: "Password Rested Successfully please login",
  });
});

export const logout: RequestHandler = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
};
