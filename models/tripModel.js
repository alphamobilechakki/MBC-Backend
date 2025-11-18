import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    source: { type: String, required: true },
    destination: { type: String, required: true },
    vehicle: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vehicle', 
        required: true 
    },
    driver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Driver', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    distance: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'ongoing', 'completed', 'cancelled', 'postponed', 'rejected'], 
        default: 'pending' 
    },
    tripDate: { type: Date, default: Date.now },
    startTripOtp: { type: String },
    endTripOtp: { type: String },
    totalAmount: { type: Number },
    paymentId: { type: String },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed'], 
        default: 'pending' 
    }
}, { timestamps: true });

const tripModel = mongoose.model("Trip", tripSchema);
export default tripModel;