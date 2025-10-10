import express from "express";
import {
  createBookingByAdmin,
  rejectBookingByAdmin,
  processBookingByAdmin,
  closeBookingByAdmin,
} from "../../controllers/booking/adminBookingController.js";

const router = express.Router();

// ✅ Create booking (Admin)
router.post("/create", createBookingByAdmin);

// ✅ Reject booking (Admin)
router.put("/reject/:id", rejectBookingByAdmin);

// ✅ Set booking to processing (Admin)
router.put("/process/:id", processBookingByAdmin);

// ✅ Close booking (Admin)
router.put("/close/:id", closeBookingByAdmin);

export default router;
