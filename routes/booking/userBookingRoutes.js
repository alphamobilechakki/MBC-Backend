import express from "express";
import {
  createUserBooking,
  cancelBookingByUser,
  getUserBookings,
} from "../../controllers/booking/userBookingController.js";

const router = express.Router();

// ✅ Create booking (User)
router.post("/create", createUserBooking);

// ✅ Cancel booking (User)
router.put("/cancel/:id", cancelBookingByUser);

// ✅ Get user bookings
router.get("/my-bookings/:userId", getUserBookings);

export default router;
