import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import OTPSchema from "../../models/OTPSchema.js";

async function verifyOTP(req, res) {
  try {
    const { mobile, otp, name, address } = req.body;

    // 1. Find OTP record
    const otpDocument = await OTPSchema.findOne({ mobile });

    if (!otpDocument) {
      return res.status(400).json({
        message: "No OTP request found for this number",
        success: false,
        error: true,
      });
    }

    // 2. Check expiry (5 minutes)
    const isExpired = (Date.now() - otpDocument.createdAt) > 5 * 60 * 1000;
    if (isExpired) {
      await OTPSchema.deleteOne({ _id: otpDocument._id }); // cleanup
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
        success: false,
        error: true,
      });
    }

    // 3. Match OTP
    if (otpDocument.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
        error: true,
      });
    }

    // 4. Check if user already exists
    let user = await userModel.findOne({ mobile });
    if (!user) {
      const payload = {
        mobile,
        name,
        role: "user",
        addresses: address ? [address] : [],
      };
      user = await new userModel(payload).save();
    }

    // 5. Delete OTP after success
    await OTPSchema.deleteOne({ _id: otpDocument._id });

    // 6. Generate JWT
    const tokenData = {
      _id: user._id,
      mobile: user.mobile,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "365d",
    });

    // 7. Response
    res.status(201).json({
      message: "User verified & logged in successfully!",
      data: { token, user },
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

export default verifyOTP;
