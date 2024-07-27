import { findAllWithPagination } from "../util/findAllWithPagination";

import InventoryBooks from "../model/inventoryBooksModel";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import Categories from "../model/categoriesModel";
import Books from "../model/booksModel";
import User from "../model/userModel";

export const getBookInventory = findAllWithPagination(
  InventoryBooks,
  {
    attributes: { exclude: ["userId"] },

    include: [
      {
        model: User,
        attributes: ["fullName", "phone", "role"],
      },
    ],
  },
  {}
);
export const getOneBookInventory = catchAsync(async (req, res, next) => {
  const bookInventory = await InventoryBooks.findByPk(req.params.bookId, {
    attributes: { exclude: ["userId"] },

    include: [
      {
        model: User,
        attributes: ["fullName", "phone", "role"],
      },
    ],
  });
  if (!bookInventory)
    return next(
      new AppError("Can't find this book with the specified Id", 404)
    );
  res.status(200).json({ status: "success", data: bookInventory });
});
export const addBook = catchAsync(async (req, res, next) => {
  const category = await Categories.findOrCreate({
    where: { name: req.body.categoryId },
    defaults: {
      name: req.body.categoryId,
    },
  });
  if (!category)
    return next(new AppError("there is a problem adding a category", 400));
  req.body.categoryId = category[0].id as number;
  const storedBook = await Books.findAll({
    where: {
      name: req.body.name,
      author: req.body.author,
      copyrightStatus: req.body.copyrightStatus,
    },
  });
  if (storedBook[0]) {
    storedBook[0].quantity += req.body.quantity;
    await storedBook[0].save();
    return res.status(200).json({ status: "success", data: storedBook[0] });
  }
  const book = await req.user.createBook(req.body);
  res.status(201).json({ status: "success", data: book });
});

export const getAllBooks = findAllWithPagination(
  Books,
  {
    order: [["createdAt", "ASC"]],

    attributes: { exclude: ["userId", "categoryId"] },
    include: [
      {
        model: User,
        attributes: ["fullName", "phone", "role"],
      },
      { model: Categories, attributes: ["name"] },
    ],
  },
  {}
);

/**
 include: [
      {
        model: User,
        attributes: ["name", "phone"],
      },
    ], */
