import express from "express";
import { getAllEntities, getEntity, createEntity, updateEntity, deleteEntity } from "../controllers/entity.controller.js";
import {isAuth, isAdmin} from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getAllEntities);
router.get("/search", isAuth, getEntity);
router.post("/", isAdmin, createEntity);
router.put("/:id", isAdmin, updateEntity);
router.delete("/:id", isAdmin, deleteEntity);

export default router;