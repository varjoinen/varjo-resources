const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const allocationSchema = new Schema({
    allocation: { type: Schema.Types.Number, required: true },
    projectId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId },
    start: { type: Schema.Types.Date },
    end: { type: Schema.Types.Date },
    tags: [{
        key: Schema.Types.String,
        value: Schema.Types.String,
    }]
});

const allocationModel = mongoose.model("Allocation", allocationSchema);

module.exports = allocationModel;