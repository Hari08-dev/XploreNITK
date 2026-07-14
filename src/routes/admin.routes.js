import express from "express";

import {

    getDashboard,

    getAllEntitiesAdmin,

    createEntityAdmin,

    updateEntityAdmin,

    deleteEntityAdmin,

    getUsers,

    updateUserRole,

    deleteUser

} from "../controllers/admin.controller.js";

const router = express.Router();

/* Dashboard */

router.get("/dashboard", getDashboard);

/* Entities */

router.get("/entities", getAllEntitiesAdmin);

router.post("/entities", createEntityAdmin);

router.put("/entities/:id", updateEntityAdmin);

router.delete("/entities/:id", deleteEntityAdmin);

/* Users */

router.get("/users", getUsers);

router.patch("/users/:id", updateUserRole);

router.delete("/users/:id", deleteUser);

export default router;