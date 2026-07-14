import userModel from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import generateToken from "../utils/generateToken.js";

export const googleAuth = async(req, res) => {
    try{
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const {credential} = req.body;
        const ticket = await client.verifyIdToken({idToken: credential, audience: process.env.GOOGLE_CLIENT_ID});
        const payload = ticket.getPayload();
        if (!payload.email_verified){
            return res.status(401).json({ message: "Email not verified"});
        }
        let user = await userModel.findOne({ email: payload.email });
        if(!user){
            user = new userModel({ name: payload.name, email: payload.email, avatar: payload.picture, googleId: payload.sub, role: 'user'});
            await user.save();
        }
        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.status(201).json({ message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, favorites: user.favorites } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logoutUser = async (req, res) => {
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

export const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, favorites: user.favorites, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const user = await userModel.findByIdAndUpdate(id, { name, email, password, role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, favorites: user.favorites } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};