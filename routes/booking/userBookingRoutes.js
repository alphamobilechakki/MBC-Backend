import express from "express";
import {
  createUserBooking,
  cancelBookingByUser,
  getUserBookings,
} from "../../controllers/booking/userBookingController.js";
import authToken from "../../middleware/authToken.js"

const router = express.Router();

// ✅ Create booking (User)
router.post("/create",authToken ,  createUserBooking);

// ✅ Cancel booking (User)
router.put("/cancel/:id", authToken ,  cancelBookingByUser);

// ✅ Get user bookings
router.get("/my-bookings/:userId",authToken ,  getUserBookings);

export default router;
