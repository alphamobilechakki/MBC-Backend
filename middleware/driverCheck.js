
const driverCheck = async (req, res, next) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Driver resource. Access denied.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default driverCheck;
