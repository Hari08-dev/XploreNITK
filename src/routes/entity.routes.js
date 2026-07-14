import express from "express";
import { getAllEntities, getEntity  } from "../controllers/entity.controller.js";
import {isAuth, isAdmin} from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getAllEntities);
router.get("/search", isAuth, getEntity);

export default router;