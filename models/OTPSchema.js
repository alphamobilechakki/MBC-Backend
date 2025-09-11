import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    default: () => Date.now() + 5 * 60 * 1000 // expires in 5 minutes
  }
});

// Auto-delete expired OTPs after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;
