import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Products in the order
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // selling price at order time
        image: { type: String, required: true }, // Cloudinary URL (built from public_id)
      },
    ],

    // Shipping address
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "India" },
      isDefault: { type: Boolean, default: false },
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI", "NetBanking", "Cashfree"],
      default: "COD",
    },
    paymentGateway: {
      type: String,
      enum: ["Cashfree", "Other"],
    },
    paymentInfo: {
      cashfree_order_id: { type: String },
      id: String, // Transaction ID (from gateway)
      status: String,
      payment_method: String,
      payment_status: String,
    },
    cashfree_order_id: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Price details
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    // Status tracking
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Payment Failed"],
      default: "Processing",
    },
    deliveredAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
