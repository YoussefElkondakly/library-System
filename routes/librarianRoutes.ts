import {
  getAllBooks,
} from "../controller/archivistController";
import {
  bookOrders,
  bookOrder,
  actionBookOrder,
 
} from "../controller/librarianController";
import { Router } from "express";
import {
  isVerified,
  protect,
  accessManager,
} from "../controller/authorizationController";
import { updateBookRequestValidation } from "../controller/validationController";
const router = Router();
router.use(protect, accessManager("LIBRARIAN"), isVerified);
router.get("/books", getAllBooks);
router.get("/bookOrders", bookOrders);
router.get("/bookOrders/:orderId", bookOrder);
router.post(
  "/bookOrders/:orderId",
  actionBookOrder
);
export default router;
