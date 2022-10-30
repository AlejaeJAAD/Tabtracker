const mongoose = require('mongoose');
const { Schema } = mongoose;

const linkSchema = mongoose.Schema({
    longLink: {
        type: String,
        required: true,
        trim: true,
    },
    nanoLink: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Link", linkSchema);