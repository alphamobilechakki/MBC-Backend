import Driver from '../../models/driverModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const driverLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const driver = await Driver.findOne({ mobile });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: driver._id, role: 'driver' }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
