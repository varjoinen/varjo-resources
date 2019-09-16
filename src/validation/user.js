const Joi = require("@hapi/joi");
const { tag } = require("./common");

const userSchema = Joi.object().keys({
    name: Joi.string().required(),
    tags: Joi.array().items(tag),
});

module.exports = {
    user: userSchema,
}