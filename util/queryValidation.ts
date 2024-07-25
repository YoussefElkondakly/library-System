import Joi from "joi";
import catchAsync from "./catchAsync";

const querySchema = Joi.object({
  page: Joi.string().pattern(/^\d+$/).default("1"),
  limit: Joi.string().pattern(/^\d+$/).default("10"),
});

const queryValidator = catchAsync(async (req, res, next) => {
  console.log(req.query.page || req.query.limit);
  if (req.query.page || req.query.limit) {
    const value = await querySchema.validateAsync(req.query);

    req.query = value;

    return next();
  }
  next();
});

export default queryValidator;
