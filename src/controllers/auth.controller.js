const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new userModel({ name, email, password, role });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.status(201).json({ message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isMatch = user.password === password;
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const user = await userModel.findByIdAndUpdate(id, { name, email, password, role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser, updateUser };