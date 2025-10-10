import Booking from "../../models/bookingModel.js";

// =========================
// Create booking (by user)
// =========================
export const createUserBooking = async (req, res) => {
  try {
    const { name, mobile, serviceType, address, user } = req.body;

    const booking = new Booking({
      name,
      mobile,
      serviceType,
      address,
      user,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
