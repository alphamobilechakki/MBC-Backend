import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true, unique: true },
    rcUpload: { type: String, required: true },
    pucUpload: { type: String, required: true },
    insuranceUpload: { type: String, required: true },
    vehicleType: { type: String, enum: ['van'], default: 'van' },
    distanceTravelled: { type: Number, default: 0 },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    }
}, { timestamps: true });

const vehicleModel = mongoose.model("Vehicle", vehicleSchema);
export default vehicleModel;