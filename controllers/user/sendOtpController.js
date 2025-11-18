import { generateOTP } from '../../utils/otpGenerator.js';
import { sendOTP } from './otpController.js';
import OtpModel from '../../models/OTPSchema.js';
import userModel from '../../models/userModel.js';

const sendOtpController = async (req, res) => {
  try {
    const { mobile } = req.body;

    const user = await userModel.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        hasAccount: false,
        message: "User not found, please sign up",
        success: false,
        error: true,
      });
    }

    // User found, proceed with OTP
    const otp = generateOTP();
    try {
      await sendOTP(mobile, otp);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        success: false,
        error: true,
      });
    }

    // Save OTP to database
    await OtpModel.findOneAndUpdate(
      { mobile },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }, // 5 minutes expiry
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "OTP sent for verification",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};

export default sendOtpController;
