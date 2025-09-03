import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    password: { type: String },
     isActive: { type: Boolean, default: true },

    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },

     createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",   // Admin who created this driver
        required: true
    }

}, { timestamps: true });

const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;
