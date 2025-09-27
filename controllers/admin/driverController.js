import Driver from '../../models/driverModel.js';
import bcrypt from 'bcryptjs';

// Create a new driver..................................................................................................................................................................
export const createDriver = async (req, res) => {
  try {
    const { name, mobile, licenseNumber, vehicleNumber, password } = req.body;
    const createdBy = req.user.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = new Driver({
      name,
      mobile,
      licenseNumber,
      vehicleNumber,
      password: hashedPassword,
      createdBy,
    });

    await driver.save();

    res.status(201).json({
      success: true,
      data: driver,
      message: 'Driver created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all drivers.................................................................................................................................................................................................................................
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({}).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      data: drivers,
      message: 'Drivers retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
