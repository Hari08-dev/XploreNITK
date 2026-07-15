import entityModel from "../models/entity.model.js";
import userModel from "../models/user.model.js";
import redisClient from "../config/redis.js";


//Dashboard

export const getDashboard = async (req, res) => {
    try {
        const cached = await redisClient.get("dashboard");

        if (cached) {
            console.log("Dashboard from Redis");
            return res.json(JSON.parse(cached));
        }

        const [ users, entities, favs, recentEntities ] = await Promise.all([
                                                                    userModel.countDocuments({ role: "user" }),
                                                                    entityModel.countDocuments(),
                                                                    userModel.find().select("favorites"),
                                                                    entityModel.find().sort({ createdAt: -1 }).limit(5).select("name timings")
                                                                ]);

        const favorites = favs.reduce(
            (sum, user) => sum + (user.favorites?.length || 0), 0
        );

        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const usersThisMonth = await userModel.countDocuments({
            createdAt: {
                $gte: startOfMonth
            },
            role: "user"
        });

        const favoriteCount = {};

        favs.forEach(user => {
            user.favorites.forEach(id => {
                const key = id.toString();
                favoriteCount[key] = (favoriteCount[key] || 0) + 1;
            });
        });

        const topFiveIds = Object.entries(favoriteCount).sort(([, a], [, b]) => b - a).slice(0, 5);

        const topTrendingPlaces = await Promise.all(
            topFiveIds.map(async ([entityId, count]) => {
                const entity = await entityModel.findById(entityId).select("name");

                return entity ? { name: entity.name, favoriteCount: count } : null;
            })
        );

        const filteredTrendingPlaces = topTrendingPlaces.filter(Boolean);

        const response = {
                            stats: {
                                users,
                                entities,
                                favorites,
                                usersThisMonth
                            },
                            recentEntities,
                            topTrendingPlaces : filteredTrendingPlaces
                        }

        await redisClient.set(
            "dashboard",
            JSON.stringify(response),
            {
                EX: 300
            }
        );

        res.json(response);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message
        });
    }
};

//Entities

export const getAllEntities = async (req, res) => {

    try {

        const entities = await entityModel.find();

        res.status(200).json({
            entities
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

export const createEntity = async (req, res) => {

    try {
        const entity = await entityModel.create(req.body);
        await redisClient.del("entities");
        await redisClient.del("dashboard");

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

export const updateEntity = async (req, res) => {

    try {

        const entity = await entityModel.findByIdAndUpdate( req.params.id, req.body, { new: true } );

        if (!entity) {
            return res.status(404).json({

                message: "Entity not found"

            });
        }

        await redisClient.del("entities");
        await redisClient.del("dashboard");

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

export const deleteEntity = async (req, res) => {

    try {
        
        await entityModel.findByIdAndDelete(req.params.id);

        await userModel.updateMany( {}, { $pull: { favorites: req.params.id } } );

        await redisClient.del("entities");
        await redisClient.del("dashboard");

        res.status(200).json({

            message: "Entity deleted"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

//Users

export const getUsers = async (req, res) => {

    try {

        const users = await userModel.find().select("-googleID").sort({ createdAt: -1 });

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

        const user = await userModel.findByIdAndUpdate( req.params.id, { role: req.body.role }, { new: true } );

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