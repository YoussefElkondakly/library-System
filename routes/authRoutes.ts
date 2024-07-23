import { Router } from "express";
import {signup,login,forgotPassword,verifyAccount,resetPassword} from './../controller/authController'
import { validatelogin, validateResetPassword, validateSignup } from "../controller/validationController";
const router=Router()

router.post("/signup", validateSignup,signup);
router.post("/login",validatelogin,login );
router.post("/forgotPassword", forgotPassword);
router.post("/verifyaccount/:verificationcode",verifyAccount );
router.patch("/resetPassword/:code", validateResetPassword, resetPassword);

export default router 

