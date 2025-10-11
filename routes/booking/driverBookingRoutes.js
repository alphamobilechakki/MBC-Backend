import express from "express";
import {
  processBookingByDriver,
  closeBookingByDriver,
} from "../../controllers/booking/driverBookingController.js";
import authToken from "../../middleware/authToken.js";
import driverCheck from "../../middleware/driverCheck.js";

const router = express.Router();

// ✅ Mark booking as processing (Driver)
router.put("/process/:id", authToken, driverCheck, processBookingByDriver);

// ✅ Close booking (Driver)
router.put("/close/:id", authToken, driverCheck, closeBookingByDriver);

export default router;
