const express = require('express');
const { registerUser, loginUser, logoutUser, getCurrentUser, updateUser } = require('../controllers/auth.controller');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", isAuth, getCurrentUser);
router.put("/user/:id", isAuth, updateUser);


module.exports = router;