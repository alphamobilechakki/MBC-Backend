import Trip from '../../models/tripModel.js';
import Driver from '../../models/driverModel.js';

// Create a new trip
export const createTrip = async (req, res) => {
    try {
        const { source, destination, vehicle, driver, user, distance, totalAmount, paymentId, paymentStatus } = req.body;

        // Generate OTPs
        const startTripOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const endTripOtp = Math.floor(1000 + Math.random() * 9000).toString();

        const trip = new Trip({
            source,
            destination,
            vehicle,
            driver,
            user,
            distance,
            startTripOtp,
            endTripOtp,
            totalAmount,
            paymentId,
            paymentStatus
        });

        await trip.save();

        // Update driver's daily trips
        const driverDoc = await Driver.findById(driver);
        if (driverDoc) {
            driverDoc.dailyTrips.push({ trip: trip._id, status: 'pending' });
            await driverDoc.save();
        }

        res.status(201).json({
            success: true,
            data: trip,
            message: 'Trip created successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all trips
export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({}).populate('vehicle').populate('driver').populate('user');
        res.status(200).json({
            success: true,
            data: trips,
            message: 'Trips retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get a single trip by ID
export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver').populate('user');
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
        res.status(200).json({
            success: true,
            data: trip,
            message: 'Trip retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update a trip
export const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
        res.status(200).json({
            success: true,
            data: trip,
            message: 'Trip updated successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Trip deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Start a trip
export const startTrip = async (req, res) => {
    try {
        const { otp } = req.body;
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
        if (trip.startTripOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
        trip.status = 'ongoing';
        await trip.save();
        res.status(200).json({
            success: true,
            data: trip,
            message: 'Trip started successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// End a trip
export const endTrip = async (req, res) => {
    try {
        const { otp } = req.body;
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
        if (trip.endTripOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
        trip.status = 'completed';
        await trip.save();

        // Update driver's stats
        const driver = await Driver.findById(trip.driver);
        if (driver) {
            driver.totalTrips += 1;
            driver.totalTripDistance += trip.distance;
            const dailyTrip = driver.dailyTrips.find(t => t.trip.toString() === trip._id.toString());
            if (dailyTrip) {
                dailyTrip.status = 'completed';
            }
            await driver.save();
        }

        res.status(200).json({
            success: true,
            data: trip,
            message: 'Trip ended successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update trip status
export const updateTripStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found',
            });
        }
        trip.status = status;
        await trip.save();

        // Update driver's daily trip status
        const driver = await Driver.findById(trip.driver);
        if (driver) {
            const dailyTrip = driver.dailyTrips.find(t => t.trip.toString() === trip._id.toString());
            if (dailyTrip) {
                dailyTrip.status = status;
                await driver.save();
            }
        }

        res.status(200).json({
            success: true,
            data: trip,
            message: 'Trip status updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
