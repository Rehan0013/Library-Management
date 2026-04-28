const Membership = require('../models/Membership');

exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMembership = async (req, res) => {
  try {
    const newMem = new Membership(req.body);
    await newMem.save();
    res.status(201).json(newMem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const { remove, ...updateData } = req.body;
    if (remove) {
      await Membership.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Membership removed' });
    }
    const updated = await Membership.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
