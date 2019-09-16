const Joi = require("@hapi/joi")
    .extend(require("@hapi/joi-date"));

// TODO refactor to a common schema for all resources
const tagSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

const allocationSchema = Joi.object().keys({
    allocation: Joi.number().required(),
    description: Joi.string(),
    allocationId: Joi.string(),
    userId: Joi.string(),
    projectId: Joi.string(),
    start: Joi.date().format('YYYY-MM-DD'),
    end: Joi.date().format('YYYY-MM-DD'),
    tags: Joi.array().items(tagSchema),
});

module.exports = {
    tag: tagSchema,
    allocation: allocationSchema,
}