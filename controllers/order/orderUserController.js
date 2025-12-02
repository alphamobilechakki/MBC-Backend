import Order from '../../models/orderModel.js';
import cashfree from '../../config/cashfree.js';
import User from '../../models/userModel.js';
import PG from "../../config/cashfree.js";
import crypto from "crypto";
import Transaction from "../../models/transactionModel.js";
// import User from "../../models/userModel.js";
// import Order from "../../models/orderModel.js";
import mongoose from "mongoose";

// Create a new order
// export const createOrder = async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
//     const userId = req.user._id;

//     const order = new Order({
//       user: userId,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const savedOrder = await order.save();

//     const user = await User.findById(userId);

//     const request = {
//       order_amount: savedOrder.totalPrice,
//       order_currency: 'INR',
//       order_note: 'Test order',
//       customer_details: {
//         customer_id: user._id.toString(),
//         customer_name: user.name,
//         customer_email: user.email,
//         customer_phone: user.mobile,
//       },
//       order_meta: {
//         return_url: `http://localhost:8080/order/{order_id}`,
//       },
//     };

//     const response = await cashfree.orders.create(request);
//     savedOrder.cashfree_order_id = response.data.order_id;
//     await savedOrder.save();

//     res.status(201).json({
//       success: true,
//       data: savedOrder,
//       cashfreeOrder: response.data,
//       message: 'Order created successfully',
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
export const createOrder = async (req, res) => {
  try {
    console.log("🟦 Creating Cashfree Order...");
    console.log("PG Test:", PG);

    const { order_amount, customer_details } = req.body;

    if (!order_amount || !customer_details) {
      return res.status(400).json({
        error: "order_amount & customer_details are required",
      });
    }

    // Generate unique order_id
    const orderId = "order_" + Date.now();

    const finalRequest = {
      order_id: orderId,
      order_amount: Number(order_amount),
      order_currency: "INR",

      customer_details: {
        customer_id: customer_details.customer_id,
        customer_name: customer_details.customer_name,
        customer_email:
          customer_details.customer_email || "mobilechakkidemo@gmail.com",
        customer_phone: customer_details.customer_phone,
      },

      order_meta: {
        return_url: `https://mobilechakki.com/payment?order_id=${orderId}&order_token=order_token`,
        notify_url: "https://api.mobilechakki.com/api/payment-webhook",
      },
    };

    console.log("➡ Final Request:", finalRequest);

    // USE PG — NOT cashfree.PG
const cfRes = await PG.orders.create(finalRequest);
console.log("PG.orders:", PG.orders);

    const order = cfRes.data;
    console.log("✅ Cashfree Order Created:", order);

    await Transaction.create({
      userId: customer_details.customer_id,
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount: order_amount,
      txStatus: "initiated",
      txnType: "credited",
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
// Get all orders for a user.......................................................................................................................................................................................................
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('user', 'name');

    res.status(200).json({
      success: true,
      data: orders,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single order by ID..................... ......................................................................................................................................................................................................
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name mobile');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};