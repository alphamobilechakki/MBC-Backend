import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["completed", "rejected_by_customer", "postponed_by_driver"],
        required: true,
    },
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
