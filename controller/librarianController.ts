import { findAllWithPagination } from "../util/findAllWithPagination";
import catchAsync from "../util/catchAsync";
import OrderedBooks from "../model/orderedBooksModel";
import Books from "../model/booksModel";
import User from "../model/userModel";
import AppError from "../util/appError";

export const bookOrders = findAllWithPagination(
  OrderedBooks,
  {
    attributes: { exclude: ["userId", "bookId"] },
    include: [
      {
        model: Books,
        attributes: ["name", "quantity", "price", "state"],
      },
      {
        model: User,
        attributes: ["fullName", "email", "phone"],
      },
    ],
  },
  {}
);
export const bookOrder = catchAsync(async (req, res, next) => {
  const order = await OrderedBooks.findAll({
    where: {
      id: req.params.orderId,
    },
    attributes: { exclude: ["userId", "bookId"] },
    include: [
      {
        model: Books,
        attributes: ["name", "quantity", "price", "state"],
      },
      {
        model: User,
        attributes: ["fullName", "email", "phone"],
      },
    ],
  });
  if (!order) return next(new AppError("No order with this Id", 400));
  res.status(200).json({ order });
});
export const actionBookOrder = catchAsync(async (req, res, next) => {
  if (!(req.body.action === "reject") && !(req.body.action === "accept"))
    return next(new AppError("you need to provide a correct action", 400));
  if (req.body.action === "reject") {
    return res.status(200).json({
      message: "Order rejected",
    });
  }
  const state = await OrderedBooks.findOne({
    where: {
      id: req.params.orderId,
    },
    attributes: ["state"],
  });
  if (state?.state)
    return next(new AppError("You are Already accepted the Order", 400));
  const order = await OrderedBooks.update(
    { state: true },
    {
      where: {
        id: req.params.orderId,
      },
      returning: true,
    }
  );
  if (!order) return next(new AppError("No order with this Id", 400));
  const filtered = order[1];
  const book = await Books.findAll({ where: { id: filtered[0].bookId } });
  if (!book) return next(new AppError("No book with this Id", 400));
  book[0].state = filtered[0].bookingType;
  book[0].returnDate = filtered[0].returnDate;
  book[0].quantity = book[0].quantity - 1;
  await book[0].save();

  res.status(200).json({
    message: "Order accepted",
    order: order,
  });
});
