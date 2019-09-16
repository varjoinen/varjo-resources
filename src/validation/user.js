const Joi = require("@hapi/joi");

const tagSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

const userSchema = Joi.object().keys({
    name: Joi.string().required(),
    tags: Joi.array().items(tagSchema),
});

module.exports = {
    tag: tagSchema,
    user: userSchema,
}