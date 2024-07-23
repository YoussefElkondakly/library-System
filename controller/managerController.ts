import { Op } from "sequelize";
import User from "../model/userModel";
import catchAsync from "../util/catchAsync";
import AppError from "./../util/appError";
import { verify } from "crypto";

export const getEmployees = catchAsync(async (req, res, next) => {
  const employees = await User.findAll({
    where: {
      [Op.or]: [{ role: "LIBRARIAN" }, { role: "ARCHIVIST" }],
    },
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "role",
      "verified",
      "createdAt",
      "updatedAt",
    ],
  });
  if(!employees)return next (new AppError("there is no emplyees on the system ",400))
    res.status(200).json({
status: "success",
data: employees,
});
});

export const verifyEmployee=catchAsync(async (req,res,next)=>{
    const id=req.params.employeeId;
    const employee = await User.findAll({
      where: {
        id: id,
        [Op.or]: [{ role: "LIBRARIAN" }, { role: "ARCHIVIST" }],
      },
    });
    if(!employee)return next (new AppError("this employee is not in the system",400))
        employee[0].verified=true;
    await employee[0].save();
    res.status(200).json({
        status: "success",
        message:employee[0].name+" Has Been Verified Successfully"
        });
})
