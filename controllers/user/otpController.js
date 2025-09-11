import axios from "axios";
import { generateOTP } from "../../utils/otpGenerator.js";

async function sendOTP(mobile) {
  const otp = generateOTP();
  const message = `Your OTP for login is ${otp}`;

  const user = process.env.BHASHSMS_USER;
  const pass = process.env.BHASHSMS_PASS;
  const sender = process.env.BHASHSMS_SENDER;
  const priority = process.env.BHASHSMS_PRIORITY; // e.g. "ndnd"
  const stype = process.env.BHASHSMS_STYPE;       // e.g. "normal"

  // Build API URL (note: use "text=" instead of "msg=")
  const url = `http://bhashsms.com/api/sendmsg.php?user=${user}&pass=${pass}&sender=${sender}&phone=${mobile}&text=${encodeURIComponent(
    message
  )}&priority=${priority}&stype=${stype}`;

  try {
    const { data } = await axios.get(url);
    console.log("BhashSMS response:", data);
  } catch (err) {
    console.error("Error sending OTP:", err.message);
  }

  return otp;
}

export { sendOTP };
