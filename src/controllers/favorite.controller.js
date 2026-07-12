import userModel from "../models/user.model.js";
import entityModel from "../models/entity.model.js";


export const toggleFavorite = async(req, res) => {
    try{
        const {entityId} = req.params;
        const entity = await entityModel.findById(entityId);
        if(!entity){
            return res.status(404).json({message: "Entity not found"});
        }
        const user = await userModel.findById(req.user.id);
        const alreadyFavorite = user.favorites.includes(entityId);
        if(alreadyFavorite){
            user.favorites = user.favorites.filter(
                (fav) => fav.toString() !== entityId
            );
            await user.save();
            return res.json({message: "Removed from favorites", user});
        }
        user.favorites.push(entityId);
        await user.save();
        return res.json({message: "Added to favorites", user});
    } catch (error){
        console.log(error);
        res.status(500).json({message: "server error"});
    }
}