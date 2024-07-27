import { Op } from "sequelize";
import User from "../model/userModel";
import catchAsync from "../util/catchAsync";
import AppError from "./../util/appError";
import { findAllWithPagination } from "../util/findAllWithPagination";
import Books from "../model/booksModel";
// ===>createInventoryBook
export const addBookInventory = catchAsync(async (req, res, next) => {
  const inventory = await req.user.createInventoryBook(req.body);
  if (!inventory) return next(new AppError("There is a problem ", 404));
  res.status(201).json({
    status: "success",
    data: inventory,
    message: "Book Inventory Added Successfully",
  });
});
export const getAllBooks = findAllWithPagination(Books, {}, {});
export const getAuthorRequest = "";
export const AcceptAuthorRequest = "";

export const getEmployees = findAllWithPagination(
  User,
  {
    where: {
      [Op.or]: [{ role: "LIBRARIAN" }, { role: "ARCHIVIST" }],
    },
    attributes: [
      "id",
      "fullName",
      "email",
      "phone",
      "role",
      "verified",
      "createdAt",
      "updatedAt",
    ],
    offset: 0,
    limit: 0,
  },
  {
    where: {
      [Op.or]: [{ role: "LIBRARIAN" }, { role: "ARCHIVIST" }],
    },
  }
);

export const getEmployee = catchAsync(async (req, res, next) => {
  const id = req.params.employeeId;
  const employees = await User.findAll({
    where: {
      [Op.or]: [{ role: "LIBRARIAN" }, { role: "ARCHIVIST" }],
      id: id,
    },
    attributes: [
      "id",
      "fullName",
      "email",
      "phone",
      "role",
      "verified",
      "createdAt",
      "updatedAt",
    ],
  });
  if (!employees)
    return next(new AppError("there is no employees on the system ", 400));
  res.status(200).json({
    status: "success",
    data: employees,
  });
});

export const verifyEmployee = catchAsync(async (req, res, next) => {
  req.query;
  const id = req.params.employeeId;
  const employee = await User.findAll({
    where: {
      id: id,
      [Op.or]: [{ role: "LIBRARIAN" }, { role: "ARCHIVIST" }],
    },
  });
  if (!employee)
    return next(new AppError("this employee is not in the system", 400));
  employee[0].verified = true;
  await employee[0].save();
  res.status(200).json({
    status: "success",
    message: employee[0].fullName + " Has Been Verified Successfully",
  });
});
