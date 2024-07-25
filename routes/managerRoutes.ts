import { addBookInventoryValidation } from "../controller/validationController";
import {
  isVerified,
  protect,
  accessManager,
} from "../controller/authorizationController";
import {
  getEmployees,
  verifyEmployee,
  getEmployee,
  addBookInventory,
} from "../controller/managerController";
import { Router } from "express";

const router=Router()
router.use(protect, accessManager("MANAGER"), isVerified);
router.post("/addBookInventory", addBookInventoryValidation, addBookInventory);
router.get('/employees',getEmployees)
router.get("/employees/:employeeId",getEmployee);
router.post("/employees/:employeeId",verifyEmployee);

export default router