import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";


export const isAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Verify the token (implement your token verification logic here)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    next();
};

export const isAdmin = async(req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decode.id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        req.user = user;
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    next();
};