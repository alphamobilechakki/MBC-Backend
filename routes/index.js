import express from "express";

import { verifyMobile, verifyOTP } from "../controllers/user/mobileVerify.js"; 
import userSignUpController from "../controllers/user/userSignUp.js";
import userLoginController from "../controllers/user/userLogin.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

// User Auth
router.post("/signup", userSignUpController);
router.post("/login", userLoginController);

// Mobile Verification
router.post("/verifyMobile", verifyMobile);
router.post("/verifyOTP", verifyOTP);

export default router;
