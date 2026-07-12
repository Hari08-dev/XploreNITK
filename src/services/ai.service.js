import { GoogleGenAI } from "@google/genai";

export const ai =  new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const askGemini = async(query, entities) => {
    try{
        const entityData = entities.map(entity => ({
            id: entity._id.toString(),
            name: entity.name,
            category: entity.category,
            description: entity.description,
            location: entity.location,
            status: entity.status
        }));

        const prompt = 
            `You are an AI assistant for XploreNITK.

            The user is searching for places inside the campus.

            Available places: ${JSON.stringify(entityData, null, 2)}

            User Query: "${query}"

            Return ONLY valid JSON.

            Example:

            {
            "results":[
                {
                "id":"entity_id",
                "reason":"Short reason"
                }
            ]
            }

            Rules:
            1. Return maximum 5 objects in results.
            2. Do NOT invent places.
            3. Use only ids provided.
            4. No markdown.
            5. No explanation outside JSON.
            `;


        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });
        return response.text;
    } catch(err){
        console.log(err);
    }
}