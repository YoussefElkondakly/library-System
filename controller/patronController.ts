import User from "../model/userModel";
import Books from "../model/booksModel";
import catchAsync from "./../util/catchAsync";
import Categories from "../model/categoriesModel";
import AppError from "../util/appError";
import OrderedBooks from "../model/orderedBooksModel";

export const getBook = catchAsync(async (req, res, next) => {
  const book = await Books.findByPk(req.params.bookId, {
    attributes: { exclude: ["userId", "categoryId"] },
    include: [
      { model: User, attributes: ["fullName", "phone", "role"] },
      { model: Categories, attributes: ["name"] },
    ],
  });
  if (!book) return next(new AppError("There is no such a book", 400));
  res.status(200).json({
    status: "success",
    data: book,
  });
});
export const bookRequest = catchAsync(async (req, res, next) => {
  const bookQuantity = await Books.findByPk(req.params.bookId, {
    attributes: ["quantity", "returnDate", "state"],
  });
  if (bookQuantity?.quantity === 0) {
    return res.status(400).json({
      message: `Book is ${bookQuantity?.state}ed right now it will be available again in ${bookQuantity?.returnDate}`,
    });
  }
  req.body.bookId = +req.params.bookId;
  const requestAbook = await req.user.createOrderedBook(req.body);
  if (!requestAbook)
    return next(new AppError("You cant add More than one Book request", 400));
  res.status(201).json({
    status: "success",
    data: requestAbook,
  });
});
export const getMyBookRequest = catchAsync(async (req, res, next) => {
  const myBookRequest = await req.user.getOrderedBooks();
  if (!myBookRequest)
    return next(new AppError("you Did not make any request", 400));
  res.status(200).json({
    status: "success",
    data: myBookRequest,
  });
});

export const updateMyBookRequest = catchAsync(async (req, res, next) => {
  const myBookRequest = await req.user.getOrderedBooks();
  if (!myBookRequest)
    return next(new AppError("you Did not make any request", 400));
  const updatedBookRequest = await myBookRequest.update(req.body, {
    where: {
      id: myBookRequest.id,
    },
    returning: true,
  });
  if (!updatedBookRequest)
    return next(new AppError("There is a problem updating document", 400));
  res.status(200).json({
    status: "success",
    data: myBookRequest,
  });
});
export const deleteMyBookRequest = catchAsync(async (req, res, next) => {
  const myBookRequest = await OrderedBooks.findOne({
    where: {
      userId: req.user.id,
    },
  });
  if (!myBookRequest)
    return next(new AppError("you Did not make any request", 400));
  await myBookRequest.destroy();
  res.status(204).json({
    status: "success",
    data: myBookRequest,
  });
});
