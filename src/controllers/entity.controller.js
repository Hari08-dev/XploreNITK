import entityModel from "../models/entity.model.js";
import redisClient from "../config/redis.js";

export const getAllEntities = async (req, res) => {

    try {
        const cached = await redisClient.get("entities");

        if (cached) {
            console.log("Serving entities from Redis");
            return res.json(JSON.parse(cached));
        }

        const entities = await entityModel.find();

        await redisClient.set(
            "entities",
            JSON.stringify(entities),
            {
                EX: 300
            }
        );

        console.log("Serving entities from MongoDB");

        res.json(entities);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};