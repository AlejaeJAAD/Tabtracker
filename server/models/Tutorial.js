const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const tutorialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        published: {
            type: Boolean,
            required: true
        },
        uid: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    { timestamps: true }
);

tutorialSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

tutorialSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Tutorial', tutorialSchema);