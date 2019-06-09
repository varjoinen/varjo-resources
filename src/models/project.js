const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String },
    start: { type: Schema.Types.Date },
    end: { type: Schema.Types.Date },
    tags: [{
        key: Schema.Types.String,
        value: Schema.Types.String,
    }]
});

const projectModel = mongoose.model("Project", projectSchema);

module.exports = projectModel;