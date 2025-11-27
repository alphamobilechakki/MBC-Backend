import express from "express";
import { createOrder, handleWebhook } from "../../controllers/payment/paymentController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
|  PAYMENT ROUTES
|--------------------------------------------------------------------------
*/

// Create Cashfree Order (Frontend → Backend)
router.post("/create-order", createOrder);

// /*
// |--------------------------------------------------------------------------
// |  WEBHOOK ROUTE (Cashfree → Backend)
// |--------------------------------------------------------------------------
// |  IMPORTANT:
// |  This route MUST use express.raw()
// |  Add this BEFORE your normal body parsers in server.js:
// |
// |  app.use("/api/payment-webhook", express.raw({ type: "*/*" }));
// |--------------------------------------------------------------------------
// */

// Webhook Route
router.post(
  "/payment-webhook",
  express.raw({ type: "*/*" }),  // required only for this route
  (req, res, next) => {
    req.rawBody = req.body;      // preserve raw buffer for signature
    try {
      req.body = JSON.parse(req.body.toString()); // convert buffer → JSON
    } catch (e) {
      console.log("Webhook JSON Parse Error:", e);
    }
    next();
  },
  handleWebhook
);

export default router;
