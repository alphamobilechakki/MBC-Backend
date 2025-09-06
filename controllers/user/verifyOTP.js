import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import msg91 from "msg91";

async function verifyOTP(req, res) {
  try {
    const { mobile, otp, name, address } = req.body;

    msg91.initialize({authKey: process.env.MSG91_AUTH_KEY});
    let otp_instance = msg91.getOTP(process.env.MSG91_TEMPLATE_ID);

    const isOTPVerified = await otp_instance.verify(mobile, otp);

    if (!isOTPVerified) {
      throw new Error("Invalid OTP");
    }

    const payload = {
      mobile,
      name,
      role: "user",
      addresses: address && [address],
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    const tokenData = {
      _id: saveUser._id,
      mobile : saveUser.mobile,
      role: saveUser.role,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "365d",
    });

    res.status(201).json({
      message: "User created Successfully!",
      data: token,
      success: true,
      error: false,
    });

  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default verifyOTP;
