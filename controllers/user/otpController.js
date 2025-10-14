import axios from "axios";
import { generateOTP } from "../../utils/otpGenerator.js";

async function sendOTP(mobile) {
  const otp = generateOTP();
  const message = `Your OTP for login is ${otp}`;

  // New provider credentials (from .env)
  const apiUrl = process.env.SMS_API_URL || "http://sms.par-ken.com/api/smsapi";
  const apiKey = process.env.SMS_API_KEY;           // e.g. 9b9cf9dbd9f4a18a817e845de787c578
  const senderId = process.env.SMS_SENDER_ID;       // e.g. MYSQFT
  const route = process.env.SMS_ROUTE || "1";       // e.g. 1 for transactional
  const templateId = process.env.SMS_TEMPLATE_ID;   // e.g. 1207161838546260705

  try {
    // Make GET request to Par-Ken SMS API
    const { data } = await axios.get(apiUrl, {
      params: {
        key: apiKey,
        routeid: route,
        senderid: senderId,
        templateid: templateId,
        contacts: mobile,
        msg: message,
      },
    });

    console.log("Par-Ken SMS response:", data);
  } catch (err) {
    console.error("Error sending OTP:", err.message);
  }

  return otp;
}

export { sendOTP };
