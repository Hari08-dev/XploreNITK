const mongoose = require("mongoose");

const entitySchema = new mongoose.Schema({

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

    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
        required: true
    }

});

const entityModel = mongoose.model("Entity", entitySchema);

module.exports = entityModel;