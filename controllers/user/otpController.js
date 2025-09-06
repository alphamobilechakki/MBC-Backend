
import msg91 from "msg91";

async function sendOTP(mobile) {
    msg91.initialize({authKey: "YOUR_AUTH_KEY"});
    let otp = msg91.getOTP("YOUR_TEMPLATE_ID");
    await otp.send(mobile);
}

export { sendOTP };
