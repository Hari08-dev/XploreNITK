const express = require('express');
const { getAllEntities, getEntity, createEntity, updateEntity, deleteEntity } = require('../controllers/entity.controller');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

router.get("/", isAuth, getAllEntities);
router.get("/search", isAuth, getEntity);
router.post("/", isAdmin, createEntity);
router.put("/:id", isAdmin, updateEntity);
router.delete("/:id", isAdmin, deleteEntity);

module.exports = router;