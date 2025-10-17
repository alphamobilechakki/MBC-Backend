
import userModel from '../../models/userModel.js';

export const addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
const userId = req.user._id || req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the new address is set as default, unset other default addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0, // Set as default if it's the first address
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
