const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
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

module.exports = isAuth;