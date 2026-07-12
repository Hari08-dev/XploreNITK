import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    avatar: String,

    googleId: String,

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entity"
    }],

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

});

const userModel = mongoose.model("User", userSchema);

export default userModel;