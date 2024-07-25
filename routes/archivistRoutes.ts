import {
  getBookInventory,
  getOneBookInventory,
  addBook,
  getAllBooks,
} from "../controller/archivistController";
import { Router } from "express";
import {
  isVerified,
  protect,
  accessManager,
} from "../controller/authorizationController";
import {  addBookValidation } from "../controller/validationController";
const router =Router()
router.use(protect, accessManager("ARCHIVIST"), isVerified);
router.get("/Books", getAllBooks);
 router.get('/getBookInventory',getBookInventory)
 router.get("/getBookInventory/:bookId", getOneBookInventory);
router.post("/addBook", addBookValidation, addBook);
export default router