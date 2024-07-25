import Joi from "joi";
import catchAsync from "../util/catchAsync";
import validator from "validator";
import AppError from "../util/appError";

export enum roleEnums {
  PATRON = "PATRON",
  LIBRARIAN = "LIBRARIAN",
  // MANAGER = "MANAGER",
  ARCHIVIST = "ARCHIVIST",
}
export enum stateEnums {
  borrow = "borrow",
  sold = "sold",
  available = "available",
}



const registerSchema = Joi.object({
  userName: Joi.string(),
  fullName: Joi.string()
    .min(5)
    .pattern(/.*\s.*\s.*/, "contains space")
    .messages({
      "string.pattern.name": "{{#label}} must contain at least Middle name and last name",
    })
    .required(),
  birthDate: Joi.date().required(),
  role: Joi.string()
    .uppercase()
    .default("PATRON")
    .custom((val: roleEnums, helper) => {
      if (!roleEnums[val])
        return helper.error("any.invalid.role", { message: "incorrect role" });
      return val;
    }),
  phone: Joi.string()
    .custom((val, helper) => {
      if (!validator.isMobilePhone(val, ["ar-EG"], { strictMode: true })) {
        return helper.error("any.invalid", {
          message: "incorrect phone number",
        });
      }
      return val;
    }, "This message for you")
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  middleName:Joi.string().lowercase(),
  birthDate:Joi.date(),
  userName:Joi.string(),
  password: Joi.string().min(8).required(),
});
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
});
const addBookInventorySchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
  isDigital: Joi.boolean().default(false),
  category:Joi.string().required()
});
const addBookSchema = Joi.object({
  name: Joi.string().required(),
  quantity:Joi.number().required(),
  author: Joi.string().required(),
  releaseDate:Joi.date().required(),
  copyrightStatus:Joi.string().required(),
  language:Joi.string().required(),
  credits:Joi.string().required(),
  isDigital: Joi.boolean().required(),
  price:Joi.number().required(),
  categoryId:Joi.string().required(),
  state:Joi.string().custom((val: stateEnums, helper) => {
      if (!stateEnums[val])
        return helper.error("any.invalid.state", { message: "incorrect state" });
      return val;
    }),
  // returnDate:Joi.string().required(),

});
const bookRequestSchema = Joi.object({
  bookingType: Joi.string().custom((val: stateEnums, helper) => {
    if (!stateEnums[val])
      return helper.error("any.invalid.type", { message: "incorrect type" });
    return val;
  }).required(),
returnDate:Joi.date().required(),

});
const updateBookRequestSchema = Joi.object({
  bookingType: Joi.string().custom((val: stateEnums, helper) => {
    if (!stateEnums[val])
      return helper.error("any.invalid.type", { message: "incorrect type" });
    return val;
  }),
  returnDate: Joi.date(),
 
});
export const validateSignup = catchAsync(async (req, res, next) => {
  if (!req.body.passwordConfirm) {
    return next(new AppError("You need to Confirm password", 403));
  }
  const value = await registerSchema.validateAsync(req.body);
  req.body = value;
  next();
});
export const validatelogin = catchAsync(async (req, res, next) => {
  if (!req.body.password) {
    return next(new AppError("You need to provide the password", 403));
  }
  const value = await loginSchema.validateAsync(req.body);
req.body=value
  next();
});
export const validateResetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.passwordConfirm) {
    return next(new AppError("You need to Confirm password", 403));
  }
  const value = await resetPasswordSchema.validateAsync(req.body);

  next();
});
export const addBookInventoryValidation = catchAsync(async (req, res, next) => {
  const value = await addBookInventorySchema.validateAsync(req.body);

  req.body = value;
  next();
});
export const addBookValidation = catchAsync(async (req, res, next) => {
  const value = await addBookSchema.validateAsync(req.body);
  req.body = value;
  next();
});
export const bookRequestValidation = catchAsync(async (req, res, next) => {
  const value = await bookRequestSchema.validateAsync(req.body);
  req.body = value;
  next();
});
export const updateBookRequestValidation = catchAsync(async (req, res, next) => {
  const value = await updateBookRequestSchema.validateAsync(req.body);
  req.body = value;
  next();
});

