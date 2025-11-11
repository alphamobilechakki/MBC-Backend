import Vehicle from '../../models/vehicleModel.js';

// Create a new vehicle
export const createVehicle = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, kilometer } = req.body;
    const { rc, puc, insurance } = req.files;

    const vehicle = new Vehicle({
      vehicleNumber,
      vehicleType,
      kilometer,
      rc: rc ? rc[0].path : undefined,
      puc: puc ? puc[0].path : undefined,
      insurance: insurance ? insurance[0].path : undefined,
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
    const vehicles = await Vehicle.find();
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
    const vehicle = await Vehicle.findById(req.params.id);
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

// Update a vehicle by ID
export const updateVehicle = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, kilometer } = req.body;
    const { rc, puc, insurance } = req.files;

    const updateData = {
      vehicleNumber,
      vehicleType,
      kilometer,
    };

    if (rc) updateData.rc = rc[0].path;
    if (puc) updateData.puc = puc[0].path;
    if (insurance) updateData.insurance = insurance[0].path;

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

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

// Delete a vehicle by ID
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
