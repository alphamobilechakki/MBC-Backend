import express from "express";
import {
  processBookingByDriver,
  closeBookingByDriver,
} from "../../controllers/booking/driverBookingController.js";

const router = express.Router();

// ✅ Mark booking as processing (Driver)
router.put("/process/:id", processBookingByDriver);

// ✅ Close booking (Driver)
router.put("/close/:id", closeBookingByDriver);

export default router;
