import userLoginController from "../controllers/user/userLogin.js";
import authToken from "../middleware/authToken.js";
import userSignUpController from "../controllers/user/userSignUp.js";
import express from "express";
import { sendOTP } from "../controllers/user/otpController.js";
import verifyOTP from "../controllers/user/verifyOTP.js";
import productUserRoutes from "./product/productUserRoutes.js";
import productAdminRoutes from "./product/productAdminRoutes.js";
import reviewUserRoutes from "./review/reviewUserRoutes.js";
import orderUserRoutes from "./order/orderUserRoutes.js";
import orderAdminRoutes from "./order/orderAdminRoutes.js";
import userProfileRoutes from "./user/userProfileRoutes.js";
import adminAuthRoutes from "./admin/adminAuthRoutes.js";
import driverRoutes from "./admin/driverRoutes.js";

const router = express.Router();

// User Auth
router.post("/signup", userSignUpController);
router.post("/login", userLoginController);

// Mobile Verification
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

//Product routes
router.use("/", productUserRoutes);
router.use("/admin", productAdminRoutes);

//Review routes
router.use("/", reviewUserRoutes);

//Order routes
router.use("/", orderUserRoutes);
router.use("/admin", orderAdminRoutes);

//Admin routes
router.use("/admin", adminAuthRoutes);
router.use("/admin", driverRoutes);

//User profile routes
router.use("/user", userProfileRoutes);

export default router;


