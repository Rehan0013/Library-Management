const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

exports.setup = async (req, res) => {
  try {
    await User.deleteMany({ userId: { $in: ['admin', 'user'] } });
    
    const hashedAdminPass = await bcrypt.hash('admin', 10);
    const newAdmin = new User({
      userId: 'admin',
      password: hashedAdminPass,
      name: 'System Administrator',
      role: 'admin',
      active: true
    });
    
    const hashedUserPass = await bcrypt.hash('user', 10);
    const newUser = new User({
      userId: 'user',
      password: hashedUserPass,
      name: 'Default User',
      role: 'user',
      active: true
    });
    
    await newAdmin.save();
    await newUser.save();
    
    res.json({ message: 'Default accounts created: admin/admin and user/user' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { userId, password, role } = req.body;
  try {
    const user = await User.findOne({ userId, role, active: true });
    if (!user) return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, id: user._id, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
