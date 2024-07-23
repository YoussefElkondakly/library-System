import {
  isVerified,
  protect,
  accessManager,
} from "../controller/authorizationController";
import { getEmployees, verifyEmployee } from "../controller/managerController";
import { Router } from "express";

const router=Router()
router.use(protect, accessManager("MANAGER"), isVerified);
router.get('/employees',getEmployees)
router.post("/employees/:employeeId",verifyEmployee);

export default router