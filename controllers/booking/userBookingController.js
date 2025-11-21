import Booking from "../../models/bookingModel.js";

// =========================
// Create booking (by user)
// =========================
export const createUserBooking = async (req, res) => {
  try {
    const { name, mobile, serviceType, user, date, address } = req.body;

    let finalAddress = null;

    // -----------------------------
    // 🟦 CASE 1: MANUAL ADDRESS
    // -----------------------------
    if (address?.mode === "manual") {
      if (!address.manualAddress) {
        return res.status(400).json({
          success: false,
          message: "Manual address data is required",
        });
      }

      finalAddress = {
        mode: "manual",
        manualAddress: {
          street: address.manualAddress.street,
          city: address.manualAddress.city,
          state: address.manualAddress.state,
          zipCode: address.manualAddress.zipCode,
          country: address.manualAddress.country || "India",
        },
      };
    }

    // -----------------------------
    // 🟩 CASE 2: MAP ADDRESS (LAT/LNG)
    // -----------------------------
    else if (address?.mode === "map") {
      if (!address.mapAddress?.lat || !address.mapAddress?.lng) {
        return res.status(400).json({
          success: false,
          message: "Latitude and Longitude are required for map address",
        });
      }

      finalAddress = {
        mode: "map",
        mapAddress: {
          lat: address.mapAddress.lat,
          lng: address.mapAddress.lng,
          formattedAddress: address.mapAddress.formattedAddress || "",
        },
      };
    }

    // -----------------------------
    // ❌ Invalid / Missing Address
    // -----------------------------
    else {
      return res.status(400).json({
        success: false,
        message:
          "Address mode must be either 'manual' or 'map' with correct data",
      });
    }

    // -----------------------------
    // ✨ Create booking
    // -----------------------------
    const booking = new Booking({
      name,
      mobile,
      serviceType,
      user,
      date: date || new Date(),
      address: finalAddress,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// Cancel booking (by user)
// =========================
export const cancelBookingByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Get user's bookings
// =========================
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
