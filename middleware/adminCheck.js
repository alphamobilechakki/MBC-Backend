import Admin from '../models/adminModel.js';

const adminCheck = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin resource. Access denied.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default adminCheck;
