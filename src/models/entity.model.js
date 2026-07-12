import mongoose from "mongoose";

const entitySchema = new mongoose.Schema({

    image: {
        type: String
    },

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String
    },

    category: {
        type: String
    },

    location: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
        required: true
    }

});

const entityModel = mongoose.model("Entity", entitySchema);

export default entityModel;