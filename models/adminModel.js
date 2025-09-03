import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile : { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { 
        type: String, 
        default: "admin", 
        enum: ["admin"] 
    },

    isActive: { type: Boolean, default: true }

}, { timestamps: true });

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;
