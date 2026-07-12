import express from "express";
import { toggleFavorite } from "../controllers/favorite.controller.js";
import {isAuth} from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/:entityId", isAuth, toggleFavorite);

export default router;