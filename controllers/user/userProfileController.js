import User from "../../models/userModel.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id || req.user?.id).select(
      "-password -__v"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findById(req.user?._id || req.user?.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    if (name) user.name = name;
    if (address) user.addresses.push(address);

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        addresses: updatedUser.addresses,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// Update user address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user?._id || req.user?.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

    // Update fields
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
      address.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      data: user.addresses,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// Delete user address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user?._id || req.user?.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({
      message: "Address deleted successfully",
      data: user.addresses,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// Get user default address
export const getDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id || req.user?.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const defaultAddress = user.addresses.find((address) => address.isDefault);

    if (!defaultAddress) {
      return res.status(404).json({
        message: "Default address not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "Default address fetched successfully",
      data: defaultAddress,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
