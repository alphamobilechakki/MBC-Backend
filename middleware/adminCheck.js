const adminCheck = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default adminCheck;
