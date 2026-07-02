const express = require('express');
const { getAllEntities, getEntityById, createEntity, updateEntity, deleteEntity } = require('../controllers/entity.controller');
const router = express.Router();

router.get("/", getAllEntities);
router.get("/search", getEntityById);
router.post("/", createEntity);
router.put("/:id", updateEntity);
router.delete("/:id", deleteEntity);

module.exports = router;