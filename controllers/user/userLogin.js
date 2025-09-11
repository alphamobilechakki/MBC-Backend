import bcrypt from 'bcryptjs';
import userModel from '../../models/userModel.js';
import jwt from 'jsonwebtoken';

const userLoginController = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await userModel.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        hasAccount: false,
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
        error: true,
      });
    }

    // ✅ Create token
    const tokenData = {
      _id: user._id,
      mobile: user.mobile,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "365d",
    });

    res.status(200).json({
      message: "Login Successfully",
      token,
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

export default userLoginController;
