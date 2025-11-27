import cashfree from "../../config/cashfree.js";
import crypto from "crypto";
import Transaction from "../../models/transactionModel.js";
import User from "../../models/userModel.js";
import Order from "../../models/orderModel.js";
import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
|  CREATE ORDER (Frontend → Backend → Cashfree)
|--------------------------------------------------------------------------
*/

export const createOrder = async (req, res) => {
  try {
    console.log("🟦 Creating Cashfree Order...");

    const { order_amount, customer_details } = req.body;

    if (!order_amount || !customer_details) {
      return res.status(400).json({
        error: "order_amount & customer_details are required",
      });
    }

    // Generate Cashfree order_id
    const orderId = "order_" + Date.now();

    const finalRequest = {
      order_id: orderId,
      order_amount: Number(order_amount),
      order_currency: "INR",
      order_note: "Wallet Recharge",

      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email || "mobilechakkidemo@gmail.com",
        customer_phone: customer_details.customer_phone,
      },

      order_meta: {
        return_url: `https://mobilechakki.com/payment?order_id=${orderId}&order_token={order_token}`,
        notify_url: "https://api.mobilechakki.com/api/payment-webhook",
      },
    };

    console.log("➡ Final Request:", finalRequest);

    // CREATE ORDER ON CASHFREE
    const response = await cashfree.PGCreateOrder("2023-08-01", finalRequest);
    const order = response.data;

    // SAVE IN DB (Transaction Table)
    await Transaction.create({
      userId: customer_details.customer_id,
      orderId: order.order_id,
      payment_session_id: order.payment_session_id,
      amount: order_amount,
      status: "initiated",
      txnType: "credited",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("❌ Cashfree API Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Cashfree API Failed",
      detail: err.response?.data || err.message,
    });
  }
};

// /*
// |--------------------------------------------------------------------------
// |  WEBHOOK HANDLER (Cashfree → Backend)
// |--------------------------------------------------------------------------
// |  IMPORTANT:
// |  Your Express must use RAW BODY:
// |
// |  app.use("/api/payment-webhook", express.raw({ type: "*/*" }));
// |
// |  NOT express.json()
// |--------------------------------------------------------------------------
// */

export const handleWebhook = async (req, res) => {
  try {
    console.log("📩 Cashfree Webhook Received");

    // -------------------------------------------------------
    // SIGNATURE VERIFICATION
    // -------------------------------------------------------
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const payload = req.rawBody;

    const secretKey = process.env.CASHFREE_CLIENT_SECRET;

    const verifier = `${timestamp}${payload}`;
    const generatedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(verifier)
      .digest("base64");

    if (generatedSignature !== signature) {
      console.log("❌ Invalid webhook signature");
      return res.sendStatus(400);
    }

    // -------------------------------------------------------
    // EXTRACT DATA
    // -------------------------------------------------------
    const { data } = req.body;
    const { order, payment } = data;

    const orderId = order.order_id;
    const paymentStatus = payment.payment_status; // SUCCESS / FAILED
    const amount = payment.payment_amount;
    const userId = order.customer_id;

    console.log("➡ Order:", orderId, "Status:", paymentStatus);

    // -------------------------------------------------------
    // UPDATE ORDER TABLE (optional – your eCommerce logic)
    // -------------------------------------------------------
    const existingOrder = await Order.findOne({ cashfree_order_id: orderId });

    if (existingOrder) {
      if (paymentStatus === "SUCCESS") {
        existingOrder.orderStatus = "Processing";
        existingOrder.paidAt = new Date(payment.payment_completion_time);
        existingOrder.paymentInfo = {
          id: payment.cf_payment_id,
          status: payment.payment_status,
          payment_method: payment.payment_group,
        };
      } else {
        existingOrder.orderStatus = "Payment Failed";
      }

      await existingOrder.save();
    }

    // -------------------------------------------------------
    // UPDATE TRANSACTION MODEL
    // -------------------------------------------------------
    const txnPayload = {
      userId,
      orderId,
      txnId: payment.cf_payment_id,
      amount,
      status: paymentStatus.toLowerCase(),
      updatedAt: Date.now(),
      txnType: "credited",
    };

    await Transaction.findOneAndUpdate(
      { orderId },
      { $set: txnPayload },
      { new: true, upsert: true }
    );

    // -------------------------------------------------------
    // UPDATE USER WALLET (NO DUPLICATE CREDITS)
    // -------------------------------------------------------
    if (paymentStatus === "SUCCESS") {
      const user = await User.findById(userId);
      if (!user) return res.sendStatus(404);

      const alreadyExists = user.balance?.some((b) => b.id === orderId);

      if (!alreadyExists) {
        const walletTxn = {
          id: orderId,
          msg: "recharge-webhook",
          amount,
        };

        await User.findByIdAndUpdate(
          userId,
          { $push: { balance: walletTxn } },
          { new: true }
        );
      }
    }

    console.log("✔ Webhook Processed Successfully →", paymentStatus);
    return res.sendStatus(200);
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
};
