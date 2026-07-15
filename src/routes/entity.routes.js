import express from "express";
import { getAllEntities  } from "../controllers/entity.controller.js";
import {isAuth, isAdmin} from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getAllEntities);

export default router;