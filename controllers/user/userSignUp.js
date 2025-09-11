import userModel from "../../models/userModel.js";
import { sendOTP } from "./otpController.js";
import OTPSchema from "../../models/OTPSchema.js";

async function userSignUpController(req, res) {
  try {
    const { mobile, address, name } = req.body;

    // Check if user already exists
    const user = await userModel.findOne({ mobile });
    if (user) {
      return res.status(409).json({
        message: "User already exists.",
        success: false,
        error: true,
      });
    }

    // Generate & send OTP
    const otp = await sendOTP(mobile);

    // Save or update OTP
    await OTPSchema.findOneAndUpdate(
      { mobile },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "OTP sent successfully!",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
      error: true,
      success: false,
    });
  }
}

export default userSignUpController;
