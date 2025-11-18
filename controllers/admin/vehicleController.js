import Vehicle from '../../models/vehicleModel.js';

// Create a new vehicle
export const createVehicle = async (req, res) => {
  try {
    const { vehicleNumber, rcUpload, pucUpload, insuranceUpload, vehicleType, driver } = req.body;

    const vehicle = new Vehicle({
      vehicleNumber,
      rcUpload,
      pucUpload,
      insuranceUpload,
      vehicleType,
      driver
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      data: vehicle,
      message: 'Vehicle created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).populate('driver', 'driverName mobileNumber');

    res.status(200).json({
      success: true,
      data: vehicles,
      message: 'Vehicles retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single vehicle by ID
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('driver', 'driverName mobileNumber');
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
        }
        res.status(200).json({
            success: true,
            data: vehicle,
            message: 'Vehicle retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update a vehicle
export const updateVehicle = async (req, res) => {
    try {
        const { vehicleNumber, rcUpload, pucUpload, insuranceUpload, vehicleType, driver } = req.body;

        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, {
            vehicleNumber,
            rcUpload,
            pucUpload,
            insuranceUpload,
            vehicleType,
            driver
        }, { new: true });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle,
            message: 'Vehicle updated successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update vehicle driver
export const updateVehicleDriver = async (req, res) => {
    try {
        const { driverId } = req.body;

        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
        }

        vehicle.driver = driverId;
        await vehicle.save();

        res.status(200).json({
            success: true,
            data: vehicle,
            message: 'Vehicle driver updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};