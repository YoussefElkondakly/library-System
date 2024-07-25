import { Router } from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyRegistration,
  resetPassword,
} from "./../controller/authController";
import {
  validatelogin,
  validateResetPassword,
  validateSignup,
} from "../controller/validationController";
import {
  fetchEmail,
  fetchUserWithProvidedPersonalData,
  fetchUserWithProvidedUserName,
} from "../controller/loginHandler";
const router = Router();

router.post("/signup", validateSignup, signup);
router.post(
  "/login",
  validatelogin,
  fetchEmail,
  fetchUserWithProvidedPersonalData,
  fetchUserWithProvidedUserName,
  login
);

router.post("/forgotPassword", forgotPassword);
router.post("/verifyregistration/:verificationcode", verifyRegistration);
router.patch("/resetPassword/:code", validateResetPassword, resetPassword);

export default router;
