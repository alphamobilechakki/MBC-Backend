import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";

async function userSignUpController(req, res) {
  try {
    const { mobile, address, name } = req.body;
    //console.log('mobile', address);

    const user = await userModel.findOne({ mobile });

    if (user) {
      throw new Error("Already user exists.");
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

export default userSignUpController;