const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Try again..!" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Try again..!" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Try again..!" });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Try again..!" });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };