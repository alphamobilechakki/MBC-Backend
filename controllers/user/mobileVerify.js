import axios from "axios";

export const verifyMobile = async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const options = {
      method: "POST",
      url: process.env.OTP_SERVICE_URL, // third party service url
      params: {
        otp_expiry: "5",
        mobile: `91${mobileNumber}`,
        authKey: process.env.OTP_AUTH_KEY,
        template_id: process.env.OTP_TEMPLATE_ID,
        realTimeResponse: "1",
      },
      headers: { "content-type": "application/json" },
      data: { Param1: mobileNumber },
    };

    const { data } = await axios.request(options);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message || "OTP sending failed",
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const options = {
      method: "GET",
      url: process.env.OTP_VERIFY_URL, // third party service url
      params: { otp, mobile: `91${mobileNumber}` },
      headers: { authKey: process.env.OTP_AUTH_KEY },
    };

    const { data } = await axios.request(options);

    if (
      data.type === "success" ||
      data.message === "OTP verified successfully" ||
      data.status === "success"
    ) {
      return res.status(200).json({
        success: true,
        verified: true,
        message: "OTP verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: data.message || "Invalid OTP, Please try again !!!",
      });
    }
  } catch (error) {
    console.error("Error in handling OTP and Login:", error);
    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message || "OTP verification failed",
    });
  }
};
