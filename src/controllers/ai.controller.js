import {askGemini} from '../services/ai.service.js'
import entityModel from '../models/entity.model.js';
import redisClient from '../config/redis.js';

export const aiSearch = async(req, res) => {
    try {
        const {query, entities} = req.body;


        const cached = await redisClient.get(query);

        if (cached) {
            console.log("AI response from Redis");
            return res.json(JSON.parse(cached));
        }

        const response = await askGemini(query, entities);
        const parsed = JSON.parse(response);
        const results = parsed.results;
        const ids = results.map(item => item.id);

        const reqEntities = await entityModel.find({
            _id: { $in: ids }
        });

        const entityMap = new Map(
            reqEntities.map(entity => [
                entity._id.toString(),
                entity
            ])
        );

        const finalResults = results.map(item => ({
            ...entityMap.get(item.id).toObject(),
            reason: item.reason
        }));

        await redisClient.set(
            query,
            JSON.stringify({finalResults}),
            {
                EX: 86400
            }
        );


        res.json({finalResults});
    } catch(err){
        console.log(err);
    }
}