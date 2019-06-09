const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    tags: [{
        key: Schema.Types.String,
        value: Schema.Types.String,
    }]
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;