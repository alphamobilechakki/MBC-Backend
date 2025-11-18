import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    driverDob: { type: Date, required: true },
    driverAdharUpload: { type: String, required: true },
    driverPanUpload: { type: String, required: true },
    driverLicenseUpload: { type: String, required: true },
    employmentCertificateUpload: { type: String, required: true },
    employmentOfficialDocsUpload: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    totalTripDistance: { type: Number, default: 0 },
    dailyTrips: [{ 
        trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }, 
        status: { type: String, enum: ['completed', 'rejected', 'postponed'] } 
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",   // Admin who created this driver
        required: true
    }
}, { timestamps: true });

const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;
