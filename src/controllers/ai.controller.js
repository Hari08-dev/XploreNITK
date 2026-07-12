import {askGemini} from '../services/ai.service.js'
import entityModel from '../models/entity.model.js';

export const aiSearch = async(req, res) => {
    try {
        const {query, entities} = req.body;
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
        res.json(finalResults);
    } catch(err){
        console.log(err);
    }
}