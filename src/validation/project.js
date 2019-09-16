const Joi = require("@hapi/joi")
    .extend(require("@hapi/joi-date"));

// TODO refactor to a common schema for all resources
const tagSchema = Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
});

const projectSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    start: Joi.date().format('YYYY-MM-DD'),
    end: Joi.date().format('YYYY-MM-DD'),
    tags: Joi.array().items(tagSchema),
});

module.exports = {
    tag: tagSchema,
    project: projectSchema,
}