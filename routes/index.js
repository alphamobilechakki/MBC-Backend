import express from "express";
import userLoginController from "../controllers/user/userLogin.js";
import userSignUpController from "../controllers/user/userSignUp.js";
import authToken from "../middleware/authToken.js";
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
import categoryAdminRoutes from "./category/categoryAdminRoutes.js";
import categoryUserRoutes from "./category/categoryUserRoutes.js";
import cartRoutes from "./cart/cartRoutes.js";
import contactRoutes from "./contact/contactRoutes.js";
import contactAdminRoutes from "./contact/contactAdminRoutes.js";
const router = express.Router();

// ✅ User Auth
router.post("/signup", userSignUpController);
router.post("/login", userLoginController);

// ✅ Mobile Verification
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

// ✅ Product routes
router.use("/", productUserRoutes);
router.use("/admin", productAdminRoutes);

// ✅ Review routes
router.use("/", reviewUserRoutes);

// ✅ Category routes
router.use("/", categoryUserRoutes);
router.use("/admin", categoryAdminRoutes);

// ✅ Order routes
router.use("/", orderUserRoutes);
router.use("/admin", orderAdminRoutes);

// ✅ Admin routes
router.use("/admin", driverRoutes);
router.use("/admin", adminAuthRoutes);

// ✅ User profile routes
router.use("/user", userProfileRoutes);

// ✅ Cart routes
router.use("/cart", cartRoutes);

// ✅ Contact Us routes
router.use("/contact", contactRoutes); 
router.use("/admin/contact" , contactAdminRoutes);

export default router;
