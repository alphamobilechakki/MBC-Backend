import mongoose from "mongoose";

// ✅ Manual address schema
const manualAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
});

// ✅ Driver schema
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  vehicleNumber: { type: String },
});

// ✅ Booking schema
const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    serviceType: {
      type: String,
      enum: ["Grinding", "Spices", "Aata", "Other"],
      required: true,
    },

    // ✅ Flexible address options
    address: {
      type: {
        mode: {
          type: String,
          enum: ["manual", "map"],
          default: "manual",
        },
        manualAddress: {
          type: manualAddressSchema,
        },
        mapAddress: {
          lat: { type: Number },
          lng: { type: Number },
          formattedAddress: { type: String },
        },
      },
      required: false,
    },

    // ✅ Booking status (includes user-cancelled)
    status: {
      type: String,
      enum: ["active", "processing", "closed", "rejected", "cancelled"],
      default: "active",
    },

    // ✅ Linked user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Assigned driver (optional)
    driver: {
      type: driverSchema,
      required: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
