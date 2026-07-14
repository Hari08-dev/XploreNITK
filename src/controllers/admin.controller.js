import entityModel from "../models/entity.model.js";
import userModel from "../models/user.model.js";

/* ---------------- Dashboard ---------------- */

export const getDashboard = async (req, res) => {
    try {

        const [
            users,
            entities,
            favs,
            recentEntities
        ] = await Promise.all([
            userModel.countDocuments({ role: "user" }),
            entityModel.countDocuments(),
            userModel.find().select("favorites"),
            entityModel.find()
                .sort({ createdAt: -1 })      // newest first
                .limit(5)
                .select("name image category location status createdAt")
        ]);

        // Total favorites
        const favorites = favs.reduce(
            (sum, user) => sum + (user.favorites?.length || 0),
            0
        );

        // Count favorites for each entity
const favoriteCount = {};

favs.forEach(user => {
    user.favorites.forEach(id => {
        const key = id.toString();
        favoriteCount[key] = (favoriteCount[key] || 0) + 1;
    });
});

// Find the entity with the highest favorites
        let topEntityId = null;
        let maxFavorites = 0;

        for (const [entityId, count] of Object.entries(favoriteCount)) {
            if (count > maxFavorites) {
                maxFavorites = count;
                topEntityId = entityId;
            }
        }

        // Fetch that entity
        let topTrendingPlace = null;

        if (topEntityId) {
            topTrendingPlace = await entityModel.findById(topEntityId).select(
                "name image"
            );

            topTrendingPlace = {
                ...topTrendingPlace.toObject(),
                favoriteCount: maxFavorites,
            };
        }

        return res.status(200).json({
            stats: {
                users: users,
                entities: entities,
                favorites: favorites
            },
            recentEntities,
            topTrendingPlace
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message
        });
    }
};

/* ---------------- Entities ---------------- */

export const getAllEntitiesAdmin = async (req, res) => {

    try {

        const entities = await entityModel.find().sort({ _id: -1 });

        res.status(200).json({
            entities
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

export const createEntityAdmin = async (req, res) => {

    try {

        const entity = await entityModel.create(req.body);

        res.status(201).json({
            message: "Entity created",
            entity
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

export const updateEntityAdmin = async (req, res) => {

    try {

        const entity = await entityModel.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true
            }

        );

        if (!entity) {

            return res.status(404).json({

                message: "Entity not found"

            });

        }

        res.status(200).json({

            message: "Entity updated",

            entity

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

export const deleteEntityAdmin = async (req, res) => {

    try {

        await entityModel.findByIdAndDelete(req.params.id);

        res.status(200).json({

            message: "Entity deleted"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

/* ---------------- Users ---------------- */

export const getUsers = async (req, res) => {

    try {

        const users = await userModel
            .find()
            .select("-googleID")
            .sort({ createdAt: -1 });

        res.status(200).json({

            users

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

export const updateUserRole = async (req, res) => {

    try {

        const user = await userModel.findByIdAndUpdate(

            req.params.id,

            {
                role: req.body.role
            },

            {
                new: true
            }

        );

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        res.status(200).json({

            message: "Role updated",

            user

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

export const deleteUser = async (req, res) => {

    try {

        await userModel.findByIdAndDelete(req.params.id);

        res.status(200).json({

            message: "User deleted"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};