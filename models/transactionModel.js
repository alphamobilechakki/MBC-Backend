import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String, // Cashfree order_id
      required: true,
      unique: true,
    },

    paymentSessionId: {
      type: String, // Cashfree payment_session_id
    },

    txStatus: {
      type: String,
      enum: ["initiated", "pending", "success", "failed"],
      default: "initiated",
    },

    txnType: {
      type: String,
      enum: ["credited", "debited"],
      default: "credited",
    },

    amount: {
      type: Number,
      required: true,
    },

    referenceId: {
      type: String, // Cashfree reference ID
    },

    paymentMethod: {
      type: String,
    },

    currency: {
      type: String,
      default: "INR",
    },

    event: {
      type: String, // webhook event name
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
