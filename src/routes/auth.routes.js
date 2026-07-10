import express from "express";
import { googleAuth, logoutUser, getCurrentUser, updateUser } from "../controllers/auth.controller.js";
import {isAuth} from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/google", googleAuth);
router.post("/logout", logoutUser);
router.get("/user", isAuth, getCurrentUser);
router.put("/user/:id", isAuth, updateUser);


export default router;