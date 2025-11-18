import axios from "axios";

async function sendOTP(mobile, otp) {
  const message = `Your OTP for login is ${otp}`;

  // Par-Ken SMS credentials
  const apiUrl = process.env.SMS_API_URL || "http://sms.par-ken.com/V2/http-api.php";
  const username = process.env.SMS_USERNAME || "mobilechakki";
  const password = process.env.SMS_PASSWORD || "123456";
  const senderId = process.env.SMS_SENDER_ID || "INFSMS";  // set your approved sender ID
  const route = process.env.SMS_ROUTE || "1";               // transactional route

  try {
    const response = await axios.get(apiUrl, {
      params: {
        username: username,
        password: password,
        senderid: senderId,
        route: route,
        number: mobile,
        message: message,
      },
    });

    // Check for failed response
    if (response.status !== 200 || response.data.includes("ERROR")) {
      throw new Error(`Failed to send OTP: ${response.data}`);
    }
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    throw err;
  }
}

export { sendOTP };
  