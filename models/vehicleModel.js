import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
    },
    rc: {
        type: String, // URL to the uploaded file
        required: true,
    },
    puc: {
        type: String, // URL to the uploaded file
        required: true,
    },
    insurance: {
        type: String, // URL to the uploaded file
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    kilometer: {
        type: Number,
        required: true,
    },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
