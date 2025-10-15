import express from "express";
import userLoginController from "../controllers/user/userLogin.js";
import userSignUpController from "../controllers/user/userSignUp.js";
import authToken from "../middleware/authToken.js";
import { sendOTP } from "../controllers/user/otpController.js";
import verifyOTP from "../controllers/user/verifyOTP.js";

// ✅ Product Routes
import productUserRoutes from "./product/productUserRoutes.js";
import productAdminRoutes from "./product/productAdminRoutes.js";

// ✅ Review Routes
import reviewUserRoutes from "./review/reviewUserRoutes.js";

// ✅ Order Routes
import orderUserRoutes from "./order/orderUserRoutes.js";
import orderAdminRoutes from "./order/orderAdminRoutes.js";

// ✅ User Profile Routes
import userProfileRoutes from "./user/userProfileRoutes.js";

// ✅ Admin Routes
import adminAuthRoutes from "./admin/adminAuthRoutes.js";
import driverRoutes from "./admin/driverRoutes.js";

// ✅ Category Routes
import categoryAdminRoutes from "./category/categoryAdminRoutes.js";
import categoryUserRoutes from "./category/categoryUserRoutes.js";

// ✅ Cart Routes
import cartRoutes from "./cart/cartRoutes.js";

// ✅ Contact Us Routes
import contactRoutes from "./contact/contactRoutes.js";
import contactAdminRoutes from "./contact/contactAdminRoutes.js";

// ✅ Booking Routes (🆕 added correctly)
import userBookingRoutes from "./booking/userBookingRoutes.js";
import driverBookingRoutes from "./booking/driverBookingRoutes.js";
import adminBookingRoutes from "./booking/adminBookingRoutes.js";

// ✅ Wishlist Routes
import wishlistRoutes from "./wishlist/wishlistRoutes.js";

const router = express.Router();

// ===============================
// ✅ User Authentication Routes
// ===============================
router.post("/signup", userSignUpController);
router.post("/login", userLoginController);

// ✅ Mobile Verification
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

// ===============================
// ✅ Product Routes
// ===============================
router.use("/", productUserRoutes);
router.use("/admin", productAdminRoutes);

// ===============================
// ✅ Review Routes
// ===============================
router.use("/", reviewUserRoutes);

// ===============================
// ✅ Category Routes
// ===============================
router.use("/", categoryUserRoutes);
router.use("/admin", categoryAdminRoutes);

// ===============================
// ✅ Order Routes
// ===============================
router.use("/", orderUserRoutes);
router.use("/admin", orderAdminRoutes);

// ===============================
// ✅ Admin Routes
// ===============================
router.use("/admin", driverRoutes);
router.use("/admin", adminAuthRoutes);

// ===============================
// ✅ User Profile Routes
// ===============================
router.use("/user", userProfileRoutes);

// ===============================
// ✅ Cart Routes
// ===============================
router.use("/cart", cartRoutes);

// ===============================
// ✅ Wishlist Routes
// ===============================
router.use("/wishlist", wishlistRoutes);

// ===============================
// ✅ Contact Routes
// ===============================
router.use("/contact", contactRoutes);
router.use("/admin/contact", contactAdminRoutes);

// ===============================
// ✅ Booking Routes (🆕 Organized)
// ===============================
router.use("/user/bookings", userBookingRoutes);
router.use("/driver/bookings", driverBookingRoutes);
router.use("/admin/bookings", adminBookingRoutes);

export default router;
