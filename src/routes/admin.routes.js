import express from "express";
import { getDashboard, getAllEntities, createEntity, updateEntity, deleteEntity, getUsers, updateUserRole, deleteUser } from "../controllers/admin.controller.js";
import { isAdmin } from "../middlewares/isAuth.js";

const router = express.Router();

router.use(isAdmin);

//Dashboard

router.get("/dashboard", getDashboard);

//entities

router.get("/entities", getAllEntities);

router.post("/entities", createEntity);

router.put("/entities/:id", updateEntity);

router.delete("/entities/:id", deleteEntity);

//users

router.get("/users", getUsers);

router.patch("/users/:id", updateUserRole);

router.delete("/users/:id", deleteUser);

export default router;