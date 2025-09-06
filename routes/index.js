import userLoginController from "../controllers/user/userLogin.js";
import authToken from "../middleware/authToken.js";
import productRoutes from "./productRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import orderRoutes from "./orderRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userProfileRoutes from "./userProfileRoutes.js";
import userSignUpController from "../controllers/user/userSignUp.js";
import express from "express";
import { sendOTP } from "../controllers/user/otpController.js";
import verifyOTP from "../controllers/user/verifyOTP.js";

const router = express.Router();

// User Auth
router.post("/signup", userSignUpController);
router.post("/login", userLoginController);

// Mobile Verification
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

//Product routes
router.use("/", productRoutes);

//Review routes
router.use("/", reviewRoutes);

//Order routes
router.use("/", orderRoutes);

//Admin routes
router.use("/", adminRoutes);

//User profile routes
router.use("/", userProfileRoutes);

export default router;


