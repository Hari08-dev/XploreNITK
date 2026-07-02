const entityModel = require('../models/entity.model');
const jwt = require('jsonwebtoken');


const getAllEntities = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "login first nigga" });
        };
        const entities = await entityModel.find();
        res.status(200).json(entities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEntityById = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "login first nigga" });
        }
        const search = req.query.search;
        const entity = await entityModel.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ]
        });
        if (!entity || entity.length === 0) {
            return res.status(404).json({ message: "Entity not found" });
        }
        res.status(200).json(entity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createEntity = async (req, res) => {
    try {
        const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        if (decode.role !== "admin") {
            return res.status(401).json({ message: "nigga spotted" });
        }
        const { name, description, status } = req.body;
        const entity = new entityModel({ name, description, status });
        await entity.save();
        res.status(201).json({ message: "Entity created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEntity = async (req, res) => {
    try {
        const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        if (decode.role !== "admin") {
            return res.status(401).json({ message: "nigga spotted" });
        }
        const { id } = req.params;
        const { name, description, status } = req.body;
        const entity = await entityModel.findByIdAndUpdate(id, { name, description, status }, { new: true });
        if (!entity) {
            return res.status(404).json({ message: "Entity not found" });
        }
        res.status(200).json({ message: "Entity updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEntity = async (req, res) => {
    try {
        const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        if (decode.role !== "admin") {
            return res.status(401).json({ message: "nigga spotted" });
        }
        const { id } = req.params;
        const entity = await entityModel.findByIdAndDelete(id);
        if (!entity) {
            return res.status(404).json({ message: "Entity not found" });
        }
        res.status(200).json({ message: "Entity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllEntities, getEntityById, createEntity, updateEntity, deleteEntity };