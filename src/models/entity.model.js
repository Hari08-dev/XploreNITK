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
        type: String
    },

    coordinates: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        }
    },

    timings: [
        {
            day: String,
            open: String,
            close: String,
            closed: Boolean
        }
    ]

}, {timestamps: true});

const entityModel = mongoose.model("Entity", entitySchema);

export default entityModel;