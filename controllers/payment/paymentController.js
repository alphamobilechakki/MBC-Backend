import cashfree from "../../config/cashfree.js";
import Order from "../../models/orderModel.js";
import crypto from "crypto";

/**
 * ----------------------------------------------------
 * CREATE ORDER
 * ----------------------------------------------------
 */
export const createOrder = async (req, res) => {
  try {
    console.log("Creating order...");

    const { order_amount, customer_details } = req.body;

    const orderId = Date.now().toString();

    const finalRequest = {
      order_id: orderId,
      order_amount,
      order_currency: "INR",
      order_note: "Test order",

      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone
      },

      order_meta: {
        return_url: `https://mobilechakki.com/payment?order_id={${orderId}}`,
        notify_url: "http://localhost:8080/api/payment-webhook"
      }
    };

    console.log("Final Request:", finalRequest);

    // ------- WORKING LINE ---------
    const response = await cashfree.orders.create(finalRequest);

    return res.json({
      success: true,
      order: response.data
    });

  } catch (err) {
    console.error("Cashfree API error:", err.message);
    return res.status(500).json({
      error: "Cashfree API Failed",
      detail: err.message
    });
  }
};


/**
 * ----------------------------------------------------
 * WEBHOOK HANDLER
 * ----------------------------------------------------
 */
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const payload = req.rawBody; // Make sure to use rawBody

    const secretKey = process.env.CASHFREE_SECRET_KEY;

    const verifier = `${timestamp}${payload}`;
    const generatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(verifier)
      .digest('base64');

    if (generatedSignature !== signature) {
      console.log('❌ Invalid webhook signature');
      return res.sendStatus(400);
    }

    const { data } = req.body;
    const { order, payment } = data;

    const orderId = order.order_id;
    const paymentStatus = payment.payment_status;

    const existingOrder = await Order.findOne({ cashfree_order_id: orderId });

    if (!existingOrder) {
      console.log(`⚠ Order not found in DB, id: ${orderId}`);
      return res.sendStatus(404);
    }

    if (paymentStatus === 'SUCCESS') {
      existingOrder.orderStatus = 'Processing';
      existingOrder.paidAt = new Date(payment.payment_completion_time);
      existingOrder.paymentInfo = {
        id: payment.cf_payment_id,
        status: payment.payment_status,
        payment_method: payment.payment_group,
      };
    } else {
      existingOrder.orderStatus = 'Payment Failed';
    }

    await existingOrder.save();

    console.log(`✔ Order updated → ${paymentStatus}`);
    return res.sendStatus(200);

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Failed to handle webhook' });
  }
};
