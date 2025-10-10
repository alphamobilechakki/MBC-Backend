import Booking from "../../models/bookingModel.js";

// =========================
// Create booking (by admin)
// =========================
export const createBookingByAdmin = async (req, res) => {
  try {
    const { name, mobile, serviceType, address, user, driver } = req.body;

    const booking = new Booking({
      name,
      mobile,
      serviceType,
      address,
      user,
      driver,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully by admin",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Reject booking (by admin)
// =========================
export const rejectBookingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking rejected by admin", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Process booking (by admin)
// =========================
export const processBookingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver } = req.body;

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
// Close booking (by admin)
// =========================
export const closeBookingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = "closed";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking closed by admin", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
