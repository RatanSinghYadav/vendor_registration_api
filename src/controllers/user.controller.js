const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error });
    }
};

// Create user
const createUser = async (req, res) => {
    try {
        const { userName, email, phone, password, role, department } = req.body;
        if (!userName || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 4);
        const user = new User({ userName, email, phone, password: hashedPassword, role, department });
        await user.save();
        res.status(201).json({ success: true, message: 'User created', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create user', error });
    }
};

// Update user (role or department)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, department } = req.body;
        const user = await User.findByIdAndUpdate(id, { role, department }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user', error });
    }
};

// Change user password
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!password) return res.status(400).json({ success: false, message: 'Password required' });
        const hashedPassword = await bcrypt.hash(password, 4);
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to change password', error });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user', error });
    }
};

// Get user stats (total users, vendors by role)
const getUserStats = async (req, res) => {
    try {
        const total = await User.countDocuments();
        const le2 = await User.countDocuments({ role: 'LE2' });
        const brly = await User.countDocuments({ role: 'BRLY' });
        const admin = await User.countDocuments({ role: 'Admin' });
        res.status(200).json({ success: true, total, le2, brly, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get stats', error });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
    getUserStats
};