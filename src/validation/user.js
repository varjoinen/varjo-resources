const Joi = require("@hapi/joi");

const tagSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

const userBaseSchema = Joi.object().keys({
    name: Joi.string().required(),
    tags: Joi.array().items(tagSchema),
});

const existingUserSchema = userBaseSchema.keys({
    id: Joi.string().required(),
});

module.exports = {
    tag: tagSchema,
    newUser: userBaseSchema,
    existingUser: existingUserSchema,
}