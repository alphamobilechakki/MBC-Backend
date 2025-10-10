import Booking from "../../models/bookingModel.js";

// =========================
// Set booking to processing (by driver)
// =========================
export const processBookingByDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver } = req.body; // assign driver info

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = "processing";
    if (driver) booking.driver = driver;

    await booking.save();
    res.status(200).json({ success: true, message: "Booking is now processing", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Close booking (by driver)
// =========================
export const closeBookingByDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = "closed";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking closed successfully", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
