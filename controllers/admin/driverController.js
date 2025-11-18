import Driver from '../../models/driverModel.js';
import bcrypt from 'bcryptjs';

// Create a new driver..................................................................................................................................................................
export const createDriver = async (req, res) => {
  try {
    const { driverName, driverDob, driverAdharUpload, driverPanUpload, driverLicenseUpload, employmentCertificateUpload, employmentOfficialDocsUpload, mobileNumber, password } = req.body;
    const createdBy = req.user.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const driver = new Driver({
      driverName,
      driverDob,
      driverAdharUpload,
      driverPanUpload,
      driverLicenseUpload,
      employmentCertificateUpload,
      employmentOfficialDocsUpload,
      mobileNumber,
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
    const drivers = await Driver.find({}).populate('createdBy', 'driverName');

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

// Get a single driver by ID.................................................................................................................................................................................................................................
export const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id).populate('createdBy', 'driverName');
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found',
            });
        }
        res.status(200).json({
            success: true,
            data: driver,
            message: 'Driver retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update a driver.................................................................................................................................................................................................................................
export const updateDriver = async (req, res) => {
    try {
        const { driverName, driverDob, driverAdharUpload, driverPanUpload, driverLicenseUpload, employmentCertificateUpload, employmentOfficialDocsUpload, mobileNumber, password } = req.body;
        
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const driver = await Driver.findByIdAndUpdate(req.params.id, {
            driverName,
            driverDob,
            driverAdharUpload,
            driverPanUpload,
            driverLicenseUpload,
            employmentCertificateUpload,
            employmentOfficialDocsUpload,
            mobileNumber,
            ...(password && { password: hashedPassword }),
        }, { new: true });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found',
            });
        }

        res.status(200).json({
            success: true,
            data: driver,
            message: 'Driver updated successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a driver.................................................................................................................................................................................................................................
export const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Driver deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
