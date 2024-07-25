import { getAllBooks } from "../controller/archivistController";
import { Router } from "express";
import {
  isVerified,
  protect,
  accessManager,
} from "../controller/authorizationController";
import {
  bookRequestValidation,
  updateBookRequestValidation,
} from "../controller/validationController";
import {
  getBook,
  bookRequest,
  getMyBookRequest,
  updateMyBookRequest,
  deleteMyBookRequest,
} from "../controller/patronController";

const router = Router();
router.use(protect, accessManager("PATRON"), isVerified);
router.get("/books", getAllBooks);
router.get("/books/getMyBookRequest", getMyBookRequest);
router.patch(
  "/books/getMyBookRequest",
  updateBookRequestValidation,
  updateMyBookRequest
);
router.delete("/books/getMyBookRequest", deleteMyBookRequest);
router.get("/books/:bookId", getBook);
router.post("/books/:bookId", bookRequestValidation, bookRequest);

export default router;
