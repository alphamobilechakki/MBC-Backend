import userModel from "../../models/userModel.js";
import { sendOTP } from "./otpController.js";

async function userSignUpController(req, res) {
  try {
    const { mobile, address, name } = req.body;

    const user = await userModel.findOne({ mobile });

    if (user) {
      throw new Error("Already user exists.");
    }

    await sendOTP(mobile);

    res.status(201).json({
      message: "OTP sent successfully!",
      data: null,
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

export default userSignUpController;