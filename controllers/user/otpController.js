
import msg91 from "msg91";

async function sendOTP(mobile) {
    msg91.initialize({authKey: process.env.MSG91_AUTH_KEY});
    let otp = msg91.getOTP(process.env.MSG91_TEMPLATE_ID);
    await otp.send(mobile);
}

export { sendOTP };
