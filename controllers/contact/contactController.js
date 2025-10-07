import Contact from "../../models/contactUsModel.js";

// ✅ Create new contact (POST /api/contact)
export const createContact = async (req, res) => {
  try {
    const { name, mobile, message } = req.body;

    if (!name || !mobile || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, mobile, message) are required",
      });
    }

    const newContact = await Contact.create({
      name,
      mobile,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This mobile number is already registered.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ✅ Get all contact requests (GET /api/contact)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contact messages.",
    });
  }
};
