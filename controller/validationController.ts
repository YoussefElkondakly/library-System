import Joi from 'joi'
import  catchAsync  from '../util/catchAsync';
import validator from 'validator'
import AppError from '../util/appError';

export enum roleEnums {
  ADMIN = "ADMIN",PATRON = "PATRON",LIBRARIAN = "LIBRARIAN",MANAGER = "MANAGER",ARCHIVIST="ARCHIVIST",
}

 const registerSchema = Joi.object({
   name: Joi.string().min(5).required(),
   role: Joi.string().uppercase().default("PATRON").custom((val: roleEnums, helper) => {
      if (!roleEnums[val])
         return helper.error("any.invalid.role", { message: "incorrect role" });
        return val;
     }),
   phone: Joi.string().custom((val, helper) => {
     if (!validator.isMobilePhone(val, ["ar-EG"], { strictMode: true })) {
       return helper.error("any.invalid", {
         message: "incorrect phone number",
       });
     }
     return val;
   }, "This message for you").required(),
   email: Joi.string().email().required(),
   password: Joi.string().min(8).required(),
   passwordConfirm: Joi.ref("password",),
 });
 const loginSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().min(8).required(),
 });
 const resetPasswordSchema = Joi.object({
   password: Joi.string().min(8).required(),
   passwordConfirm: Joi.ref("password"),
 });


export const validateSignup = catchAsync(async (req, res, next) => {
  if(!req.body.passwordConfirm){

    return next(new AppError("You need to Confirm password",403))
  }
  const value = await registerSchema.validateAsync(req.body);
  req.body = value;
  next();
});
export const validatelogin = catchAsync(async (req, res, next) => {
  if(!req.body.password){

    return next(new AppError("You need to provide the password",403))
  }
  const value = await loginSchema.validateAsync(req.body);
  
  next();
});
export const validateResetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.passwordConfirm) {
    return next(new AppError("You need to Confirm password", 403));
  }
  const value = await resetPasswordSchema.validateAsync(req.body);
 
  next();
});


/*
 * .messages({
    'any.invalid': '{{#label}} {{#message}}'
});
const mapJoiErrorToMessage = (error) => {
    switch (error.code) {
        case 'any.required':
            return 'This field is required.';
        case 'string.min':
            return `Input must be at least ${error.context.limit} characters long.`;
        case 'phoneNumber.invalidFormat':
            return 'Please enter a valid phone number.';
        default:
            return 'Validation error.';
    }
};
*/